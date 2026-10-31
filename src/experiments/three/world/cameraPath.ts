import { Easing } from "remotion";

type V3 = [number, number, number];
export type CamKey = { f: number; pos: V3; target: V3 };

const ease = Easing.inOut(Easing.cubic);
const lerp3 = (a: V3, b: V3, t: number): V3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Kamera zwischen Keyframes, jeweils mit Ease-in-out; zwischen zwei Keys mit gleichem Wert steht sie still.
export const cameraAt = (frame: number, keys: CamKey[]): { pos: V3; target: V3 } => {
  if (frame <= keys[0].f) return keys[0];
  for (let k = 0; k < keys.length - 1; k++) {
    const a = keys[k];
    const b = keys[k + 1];
    if (frame <= b.f) {
      const t = ease((frame - a.f) / (b.f - a.f));
      return { pos: lerp3(a.pos, b.pos, t), target: lerp3(a.target, b.target, t) };
    }
  }
  return keys[keys.length - 1];
};
