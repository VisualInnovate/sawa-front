// One Agora call on this page: joins the channel with the token the backend made, publishes the microphone (and the
// camera for a video call) and keeps the other members' tracks in a reactive list for the call window to play.
// The SDK (about 1.7 MB) is loaded with the first call, not with every page.
import { reactive, markRaw } from "vue";

let AgoraRTC = null;
async function loadSdk() {
  if (!AgoraRTC) {
    AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
    AgoraRTC.setLogLevel(3); // warnings and errors only
  }
  return AgoraRTC;
}

export const session = reactive({
  joined: false,
  joining: false,
  micOn: true,
  camOn: false,
  video: false,
  remotes: [], // { uid, hasAudio, hasVideo, videoTrack, audioTrack, volume }
  speaking: null,
  network: null,
  error: null,
});

let client = null;
let mic = null;
let cam = null;
let renew = null;

const remote = (uid) => {
  let r = session.remotes.find((x) => x.uid === uid);
  if (!r) {
    r = { uid, hasAudio: false, hasVideo: false, videoTrack: null, audioTrack: null, volume: 0 };
    session.remotes.push(r);
  }
  return r;
};

/**
 * @param token {app_id, channel, uid, token}
 * @param video whether to publish the camera
 * @param onRenew async () => new token object (called before the token ends)
 */
export async function joinCall(token, video, onRenew) {
  if (client) await leaveCall();
  Object.assign(session, { joined: false, joining: true, micOn: true, camOn: video, video, remotes: [], speaking: null, error: null });
  renew = onRenew;
  await loadSdk();
  client = markRaw(AgoraRTC.createClient({ mode: "rtc", codec: "vp8" }));

  client.on("user-published", async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    const r = remote(user.uid);
    if (mediaType === "audio") {
      r.audioTrack = markRaw(user.audioTrack);
      r.hasAudio = true;
      user.audioTrack.play();
    } else {
      r.videoTrack = markRaw(user.videoTrack);
      r.hasVideo = true;
    }
  });
  client.on("user-unpublished", (user, mediaType) => {
    const r = remote(user.uid);
    if (mediaType === "audio") r.hasAudio = false;
    else {
      r.hasVideo = false;
      r.videoTrack = null;
    }
  });
  client.on("user-joined", (user) => remote(user.uid));
  client.on("user-left", (user) => {
    session.remotes = session.remotes.filter((x) => x.uid !== user.uid);
  });
  client.on("network-quality", (q) => {
    session.network = q.uplinkNetworkQuality;
  });
  client.enableAudioVolumeIndicator();
  client.on("volume-indicator", (volumes) => {
    const loudest = volumes.filter((v) => v.level > 5).sort((a, b) => b.level - a.level)[0];
    session.speaking = loudest?.uid ?? null;
  });
  client.on("token-privilege-will-expire", async () => {
    try {
      const fresh = await renew?.();
      if (fresh?.token) await client.renewToken(fresh.token);
    } catch {
      // the call goes on until the token really ends
    }
  });

  try {
    await client.join(token.app_id, token.channel, token.token, token.uid);
    mic = markRaw(await AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true, AGC: true }));
    const tracks = [mic];
    if (video) {
      try {
        cam = markRaw(await AgoraRTC.createCameraVideoTrack({ encoderConfig: "480p_1" }));
        tracks.push(cam);
      } catch {
        session.camOn = false;
        session.error = "camera";
      }
    }
    await client.publish(tracks);
    session.joined = true;
  } catch (e) {
    session.error = e?.code === "PERMISSION_DENIED" || e?.name === "NotAllowedError" ? "permission" : "join";
    await leaveCall();
    throw e;
  } finally {
    session.joining = false;
  }
}

export const localVideoTrack = () => cam;

export async function toggleMic() {
  if (!mic) return;
  session.micOn = !session.micOn;
  await mic.setEnabled(session.micOn);
}

export async function toggleCam() {
  if (!client) return;
  if (!cam) {
    try {
      cam = markRaw(await AgoraRTC.createCameraVideoTrack({ encoderConfig: "480p_1" }));
      await client.publish(cam);
      session.camOn = true;
      session.video = true;
    } catch {
      session.error = "camera";
    }
    return;
  }
  session.camOn = !session.camOn;
  await cam.setEnabled(session.camOn);
}

export async function leaveCall() {
  for (const track of [mic, cam]) {
    try {
      track?.stop();
      track?.close();
    } catch {
      // closed
    }
  }
  mic = null;
  cam = null;
  try {
    await client?.leave();
  } catch {
    // left
  }
  client = null;
  Object.assign(session, { joined: false, joining: false, remotes: [], speaking: null });
}
