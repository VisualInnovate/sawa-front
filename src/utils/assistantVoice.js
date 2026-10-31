// The assistant's voice, from the browser itself (no service, no cost): the mic turns what the user says into text
// (SpeechRecognition) and the answers are read aloud (speechSynthesis). An answer is read sentence by sentence while it
// is still being written, so it starts speaking after its first sentence. Arabic quality depends on the device:
// recognition is good on Chrome / Android, weaker on Safari; the voice is the device's own.
import { onBeforeUnmount, ref } from "vue";

const Recognition = globalThis.SpeechRecognition ?? globalThis.webkitSpeechRecognition;
const synth = globalThis.speechSynthesis;

// What is read: the text without **bold** marks, links and emoji; a phone number is read digit by digit.
const spoken = (text) =>
  text
    .replace(/\*\*/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\+?\d[\d -]{6,}\d/g, (n) => n.replace(/\D/g, "").split("").join(" "))
    .trim();

export function useAssistantVoice(lang) {
  const canListen = !!Recognition;
  const canSpeak = !!synth;
  const listening = ref(false);
  const speaking = ref(false);
  const error = ref("");

  // ── Listening ──
  let recognition = null;
  function listen({ onText, onEnd }) {
    if (!canListen || listening.value) return;
    stopSpeaking();
    error.value = "";
    recognition = new Recognition();
    recognition.lang = lang();
    recognition.interimResults = true;
    recognition.continuous = false;
    let text = "";
    recognition.onresult = (event) => {
      text = Array.from(event.results, (r) => r[0].transcript).join(" ");
      onText(text);
    };
    recognition.onerror = (event) => {
      // "no-speech" and "aborted" are not errors for the user: nothing was said, or they stopped it.
      if (!["no-speech", "aborted"].includes(event.error)) error.value = event.error === "not-allowed" || event.error === "service-not-allowed" ? "mic_denied" : "mic_failed";
    };
    recognition.onend = () => {
      listening.value = false;
      recognition = null;
      onEnd(text.trim());
    };
    listening.value = true;
    try {
      recognition.start();
    } catch {
      listening.value = false;
      error.value = "mic_failed";
    }
  }
  function stopListening() {
    recognition?.stop();
  }

  // ── Speaking ──
  // The voice of the language (Jordanian first for Arabic); the list fills late on Chrome.
  let voice = null;
  const pickVoice = () => {
    const wanted = lang();
    const voices = synth.getVoices();
    const short = wanted.slice(0, 2);
    voice = voices.find((v) => v.lang === wanted) ?? voices.find((v) => v.lang?.startsWith(short)) ?? null;
  };
  if (canSpeak) {
    pickVoice();
    synth.addEventListener?.("voiceschanged", pickVoice);
  }

  let pending = 0;
  function say(text) {
    text = spoken(text);
    if (!canSpeak || !text) return;
    if (!voice) pickVoice();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice?.lang ?? lang();
    if (voice) utterance.voice = voice;
    pending++;
    speaking.value = true;
    utterance.onend = utterance.onerror = () => {
      pending = Math.max(0, pending - 1);
      if (!pending) speaking.value = false;
    };
    synth.speak(utterance);
  }
  function stopSpeaking() {
    if (!canSpeak) return;
    pending = 0;
    speaking.value = false;
    synth.cancel();
  }
  // Safari speaks only after a tap: an empty sentence inside the tap allows the answer that comes later.
  function unlock() {
    if (canSpeak && !speaking.value) synth.speak(new SpeechSynthesisUtterance(""));
  }

  // An answer that is still being written: feed it the text so far, it reads each finished sentence, finish() reads the rest.
  function reader() {
    let read = 0;
    return {
      feed(text) {
        const rest = text.slice(read);
        const cut = Math.max(...[".", "!", "?", "؟", "\n", "؛"].map((c) => rest.lastIndexOf(c)));
        if (cut < 0) return;
        say(rest.slice(0, cut + 1));
        read += cut + 1;
      },
      finish(text) {
        say(text.slice(read));
        read = text.length;
      },
    };
  }

  onBeforeUnmount(() => {
    recognition?.abort();
    stopSpeaking();
    synth?.removeEventListener?.("voiceschanged", pickVoice);
  });

  return { canListen, canSpeak, listening, speaking, error, listen, stopListening, say, stopSpeaking, unlock, reader };
}
