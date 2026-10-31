// The assistant's voice. With the server's voice service (ElevenLabs, `server()` true) the mic records the question
// and the server turns it into text (Arabic dialects included), and the answer is read by a native Levantine voice;
// otherwise the browser's own recognition and voice are used.
//
// Listening waits for the user to talk and stops only after 3 seconds of silence (a pause inside a sentence does not
// send it). The answer is read in pieces while it is still being written; each piece is sent with the text before it so
// the voice keeps one flowing intonation, and the pieces play back to back through one AudioContext.
import { onBeforeUnmount, ref } from "vue";

const Recognition = globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition;
const synth = globalThis.speechSynthesis;
const AudioCtx = globalThis.AudioContext ?? globalThis.webkitAudioContext;
const canRecord = !!(globalThis.navigator?.mediaDevices?.getUserMedia && globalThis.MediaRecorder && AudioCtx);

// The question is sent after this much silence once the user has started talking.
const SILENCE_MS = 3000;
// Nobody talked: the mic closes by itself.
const NO_SPEECH_MS = 8000;
const MAX_MS = 60000;

// What is read: the text without **bold** marks, links and emoji; a phone number is read digit by digit.
const spoken = (text) =>
  text
    .replace(/\*\*/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/^\s*[-•*]\s+/gm, "")
    .replace(/\+?\d[\d -]{6,}\d/g, (n) => n.replace(/\D/g, "").split("").join(" "))
    .trim();

// The recorder's format: webm/opus (Chrome, Firefox, Android) or mp4 (Safari).
const recordType = () => ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"].find((t) => globalThis.MediaRecorder?.isTypeSupported?.(t)) ?? "";

/**
 * @param lang    () => "ar-JO" | "en-US"
 * @param server  () => whether the server's voice service is on
 * @param request (path, init) => fetch to the assistant's API with the user's token
 */
export function useAssistantVoice({ lang, server = () => false, request = null }) {
  const useServer = () => !!(server() && request);
  const canListen = canRecord || !!Recognition;
  const canSpeak = !!(AudioCtx || synth);
  const listening = ref(false);
  // The recording is being turned into text.
  const transcribing = ref(false);
  const speaking = ref(false);
  // The mic's loudness (0–1) while listening, for the button's ring.
  const level = ref(0);
  const error = ref("");
  // The browser's own reason when listening fails (shown with the message, so a failing device can be told apart).
  const errorCode = ref("");

  // One AudioContext for the recording's meter and for playing the answers. Made (or woken) inside a tap, so
  // browsers that only play sound after a tap let the answers that come later play too.
  let ctx = null;
  function unlock() {
    if (!AudioCtx) return;
    ctx ??= new AudioCtx();
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
  }

  // ── Listening ──
  let stopNow = null; // ends the current listening and sends what was said
  let cancelNow = null; // ends it and drops it
  const ERRORS = { NotAllowedError: "mic_denied", SecurityError: "mic_denied", NotFoundError: "mic_capture", NotReadableError: "mic_capture" };
  const RECOGNITION_ERRORS = { "not-allowed": "mic_denied", "service-not-allowed": "mic_denied", network: "mic_network", "audio-capture": "mic_capture" };

  function fail(key, code = "") {
    error.value = key;
    errorCode.value = code;
  }

  /** Listens until the user stops talking; onEnd gets the text ('' when nothing was said). */
  function listen({ onText = () => {}, onEnd }) {
    if (!canListen || listening.value || transcribing.value) return;
    stopSpeaking();
    error.value = "";
    errorCode.value = "";
    if (useServer() && canRecord) return record(onEnd);
    if (Recognition) return recognise(onText, onEnd);
    fail("mic_failed");
  }

  // The server's way: record, watch the loudness for the silence, then send the recording.
  async function record(onEnd) {
    listening.value = true;
    unlock();
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
    } catch (e) {
      listening.value = false;
      fail(ERRORS[e?.name] ?? "mic_failed", e?.name ?? "");
      return;
    }
    const type = recordType();
    const recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks = [];
    recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);

    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);

    // The room's own noise is measured in the first moments; speech is clearly louder than it.
    const started = performance.now();
    let floor = 0;
    let floorSamples = 0;
    let talking = false;
    let loudSince = 0;
    let quietSince = 0;
    let dropped = false;

    const timer = setInterval(() => {
      analyser.getFloatTimeDomainData(samples);
      let sum = 0;
      for (const s of samples) sum += s * s;
      const rms = Math.sqrt(sum / samples.length);
      level.value = Math.min(1, rms * 8);
      const now = performance.now();
      if (now - started < 300) {
        floor = (floor * floorSamples + rms) / ++floorSamples;
        return;
      }
      const threshold = Math.max(0.012, floor * 2.5);
      if (rms > threshold) {
        quietSince = 0;
        loudSince ||= now;
        // A short click is not speech: it has to last a moment.
        if (!talking && now - loudSince > 150) talking = true;
      } else {
        loudSince = 0;
        quietSince ||= now;
        if (talking && now - quietSince >= SILENCE_MS) finish();
      }
      if (!talking && now - started > NO_SPEECH_MS) finish();
      if (now - started > MAX_MS) finish();
    }, 50);

    function finish() {
      clearInterval(timer);
      stopNow = cancelNow = null;
      if (recorder.state !== "inactive") recorder.stop();
    }
    stopNow = () => {
      // Stopped by hand: send what was said even without the 3 seconds.
      talking ||= performance.now() - started > 600;
      finish();
    };
    cancelNow = () => {
      dropped = true;
      finish();
    };

    recorder.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      source.disconnect();
      listening.value = false;
      level.value = 0;
      if (dropped) return;
      if (!talking || !chunks.length) return onEnd("");
      transcribing.value = true;
      try {
        const body = new FormData();
        const blob = new Blob(chunks, { type: recorder.mimeType || type || "audio/webm" });
        body.append("audio", blob, `question.${blob.type.includes("mp4") ? "mp4" : blob.type.includes("ogg") ? "ogg" : "webm"}`);
        body.append("lang", lang().slice(0, 2));
        const response = await request("voice/transcribe", { method: "POST", body });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          fail("mic_failed", data.message ?? String(response.status));
          return onEnd("");
        }
        onEnd((data.data?.text ?? "").trim());
      } catch (e) {
        fail("mic_failed", e?.message ?? "");
        onEnd("");
      } finally {
        transcribing.value = false;
      }
    };
    recorder.start(250);
  }

  // The browser's way: its own recognition, kept open, ended by our own 3-second silence timer.
  const tried = new Set();
  function recognise(onText, onEnd) {
    const recognition = new Recognition();
    const wanted = lang();
    recognition.lang = tried.has(wanted) ? wanted.slice(0, 2) : wanted;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    let text = "";
    let retry = false;
    let dropped = false;
    let silence = null;
    const wait = (ms) => {
      clearTimeout(silence);
      silence = setTimeout(() => recognition.stop(), ms);
    };
    wait(NO_SPEECH_MS);
    recognition.onresult = (event) => {
      text = Array.from(event.results, (r) => r[0].transcript).join(" ");
      onText(text);
      wait(SILENCE_MS);
    };
    recognition.onerror = (event) => {
      if (["no-speech", "aborted"].includes(event.error)) return;
      if (event.error === "language-not-supported" && !tried.has(wanted)) {
        tried.add(wanted);
        retry = true;
        return;
      }
      fail(RECOGNITION_ERRORS[event.error] ?? "mic_failed", event.error ?? "");
    };
    recognition.onend = () => {
      clearTimeout(silence);
      listening.value = false;
      stopNow = cancelNow = null;
      if (dropped) return;
      if (retry) return recognise(onText, onEnd);
      onEnd(text.trim());
    };
    stopNow = () => recognition.stop();
    cancelNow = () => {
      dropped = true;
      recognition.abort();
    };
    listening.value = true;
    try {
      recognition.start();
    } catch (e) {
      listening.value = false;
      stopNow = cancelNow = null;
      fail("mic_failed", e?.name ?? "");
    }
  }

  /** Stops listening and sends what was said. */
  function stopListening() {
    stopNow?.();
  }
  /** Stops listening and drops it. */
  function cancelListening() {
    cancelNow?.();
  }

  // ── Speaking ──
  // A queue of pieces: each one's audio is fetched at once (so the next is ready when the one before ends) and they
  // play in order. `round` drops pieces of an answer that was stopped.
  let round = 0;
  let queue = Promise.resolve();
  let pending = 0;
  let playing = null;
  let drainedWaiters = [];
  const settle = () => {
    pending = Math.max(0, pending - 1);
    if (pending) return;
    speaking.value = false;
    drainedWaiters.splice(0).forEach((resolve) => resolve());
  };

  // The browser's voice, for when the server has none (Jordanian first for Arabic); the list fills late on Chrome.
  let browserVoice = null;
  const pickVoice = () => {
    const wanted = lang();
    const voices = synth.getVoices();
    browserVoice = voices.find((v) => v.lang === wanted) ?? voices.find((v) => v.lang?.startsWith(wanted.slice(0, 2))) ?? null;
  };
  if (synth) {
    pickVoice();
    synth.addEventListener?.("voiceschanged", pickVoice);
  }
  function browserSay(text) {
    return new Promise((resolve) => {
      if (!synth) return resolve();
      if (!browserVoice) pickVoice();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = browserVoice?.lang ?? lang();
      if (browserVoice) utterance.voice = browserVoice;
      utterance.onend = utterance.onerror = () => resolve();
      synth.speak(utterance);
    });
  }

  async function fetchAudio(text, previous) {
    const response = await request("voice/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text, previous: previous || null }),
    });
    if (!response.ok) throw new Error(String(response.status));
    return ctx.decodeAudioData(await response.arrayBuffer());
  }
  async function play(buffer, mine, text) {
    // A browser that kept the sound locked (no tap yet) would never end the piece: its own voice reads it instead.
    if (ctx.state !== "running") await Promise.race([ctx.resume().catch(() => {}), new Promise((r) => setTimeout(r, 500))]);
    if (ctx.state !== "running") return browserSay(text);
    return new Promise((resolve) => {
      if (mine !== round) return resolve();
      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ctx.destination);
      node.onended = () => {
        if (playing === node) playing = null;
        resolve();
      };
      playing = node;
      node.start();
    });
  }

  /** Reads one piece; `previous` is the text read just before it (keeps the intonation flowing). */
  function say(text, previous = "") {
    text = spoken(text);
    if (!canSpeak || !text) return;
    const mine = round;
    pending++;
    speaking.value = true;
    const server = useServer() && AudioCtx;
    if (server) unlock();
    const audio = server ? fetchAudio(text, spoken(previous)).catch(() => null) : null;
    queue = queue.then(async () => {
      if (mine !== round) return;
      if (server) {
        const buffer = await audio;
        if (mine !== round) return;
        // The server's voice failed: the browser reads this piece rather than skipping it.
        await (buffer ? play(buffer, mine, text) : browserSay(text));
      } else {
        await browserSay(text);
      }
    }).catch(() => {});
    // A stopped answer's pieces no longer count.
    queue.finally(() => mine === round && settle());
  }
  function stopSpeaking() {
    round++;
    try {
      playing?.stop();
    } catch {
      // already ended
    }
    playing = null;
    synth?.cancel();
    pending = 0;
    queue = Promise.resolve();
    speaking.value = false;
    drainedWaiters.splice(0).forEach((resolve) => resolve());
  }
  /** Resolves when everything queued so far has been read (or stopped). */
  function drained() {
    return pending ? new Promise((resolve) => drainedWaiters.push(resolve)) : Promise.resolve();
  }

  // An answer that is still being written: feed it the text so far, it reads it in whole sentences, finish() reads
  // the rest. The first piece is short so the voice starts soon; later pieces are longer so it sounds continuous.
  function reader() {
    let read = 0;
    return {
      feed(text) {
        const rest = text.slice(read);
        const cut = Math.max(...[".", "!", "?", "؟", "\n", "؛", "،"].map((c) => rest.lastIndexOf(c)));
        if (cut < (read ? 120 : 40)) return;
        say(rest.slice(0, cut + 1), text.slice(0, read));
        read += cut + 1;
      },
      finish(text) {
        say(text.slice(read), text.slice(0, read));
        read = text.length;
      },
    };
  }

  onBeforeUnmount(() => {
    cancelListening();
    stopSpeaking();
    synth?.removeEventListener?.("voiceschanged", pickVoice);
    ctx?.close?.().catch(() => {});
  });

  return {
    canListen, canSpeak, listening, transcribing, speaking, level, error, errorCode,
    listen, stopListening, cancelListening, say, stopSpeaking, drained, unlock, reader,
  };
}
