// Synthesized with Web Audio, so no sound assets are shipped.
export const SOUNDS = ["off", "click", "beep", "pop", "square", "tick"] as const;
export type SoundId = (typeof SOUNDS)[number];

let ctx: AudioContext | null = null;

function tone(
  ac: AudioContext,
  type: OscillatorType,
  from: number,
  to: number,
  ms: number,
  gain: number,
) {
  const osc = ac.createOscillator();
  const amp = ac.createGain();
  const t = ac.currentTime;
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + ms / 1000);
  amp.gain.setValueAtTime(gain, t);
  amp.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000);
  osc.connect(amp).connect(ac.destination);
  osc.start(t);
  osc.stop(t + ms / 1000);
}

function noise(ac: AudioContext, ms: number, gain: number) {
  const length = Math.floor((ac.sampleRate * ms) / 1000);
  const buffer = ac.createBuffer(1, length, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 3;
  const src = ac.createBufferSource();
  const filter = ac.createBiquadFilter();
  const amp = ac.createGain();
  src.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 2000;
  amp.gain.value = gain;
  src.connect(filter).connect(amp).connect(ac.destination);
  src.start();
}

export function playSound(sound: SoundId, volume: number) {
  if (sound === "off" || volume <= 0) return;
  ctx ??= new AudioContext();
  if (ctx.state === "suspended") void ctx.resume();
  const v = volume * 0.4;
  switch (sound) {
    case "click":
      return noise(ctx, 25, v * 2);
    case "beep":
      return tone(ctx, "sine", 880, 880, 70, v);
    case "pop":
      return tone(ctx, "triangle", 600, 200, 60, v * 1.5);
    case "square":
      return tone(ctx, "square", 500, 500, 40, v * 0.4);
    case "tick":
      return tone(ctx, "sine", 2000, 1200, 20, v);
  }
}
