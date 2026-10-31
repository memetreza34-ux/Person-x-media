import { noise2D } from "@remotion/noise";
import { interpolate } from "remotion";

// Blinzeln alle ~3 Sekunden, jeweils 5 Frames lang.
export const blinkAt = (frame: number, fps: number, seed = 0): number => {
  const period = Math.round(fps * 3.1);
  const t = (frame + seed * 37) % period;
  return interpolate(t, [0, 2, 5], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
};

// Mundöffnung beim Sprechen, organisch per Noise.
export const talkAt = (frame: number, speaking: boolean): number => {
  if (!speaking) return 0;
  const n = noise2D("talk", frame / 3.2, 0);
  return Math.max(0, Math.min(1, 0.45 + n * 0.6));
};

// Leichtes Kopf-Mitbewegen beim Sprechen.
export const headIdle = (frame: number) => ({
  nod: noise2D("nod", frame / 40, 1) * 0.06,
  tilt: noise2D("tilt", frame / 55, 2) * 0.05,
  turn: noise2D("turn", frame / 70, 3) * 0.08,
});
