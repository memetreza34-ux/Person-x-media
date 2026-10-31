import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, INK } from "../design/theme";

// Alle Einblendungen bekommen ihren Startframe (`at`) und animieren sich selbst rein.
const usePop = (at: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping, stiffness: 170 } });
};

const card = {
  border: `5px solid ${INK}`,
  borderRadius: 26,
  boxShadow: `0 10px 0 ${INK}`,
  fontFamily: FONT,
  color: INK,
};

export const ClockBadge: React.FC<{ hour: number; at: number }> = ({ hour, at }) => {
  const p = usePop(at);
  const h = Math.floor(hour);
  const m = Math.floor((hour - h) * 60);
  const night = hour < 6 || hour > 20;
  return (
    <div style={{ position: "absolute", top: 120, width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          ...card,
          background: night ? "#2E2B5E" : "#FFF8EE",
          color: night ? "#FFF8EE" : INK,
          padding: "10px 34px",
          fontSize: 64,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 18,
          transform: `scale(${p})`,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span style={{ fontSize: 54 }}>{night ? "☾" : "☀"}</span>
        {String(h).padStart(2, "0")}:{String(m).padStart(2, "0")}
      </div>
    </div>
  );
};

export const Tag: React.FC<{ x: number; y: number; text: string; at: number; color?: string; textColor?: string }> = ({ x, y, text, at, color = "#FFF8EE", textColor = INK }) => {
  const p = usePop(at, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${p}) rotate(${(1 - p) * -12}deg)`,
        ...card,
        borderRadius: 999,
        boxShadow: `0 6px 0 ${INK}`,
        background: color,
        color: textColor,
        padding: "10px 30px",
        fontSize: 46,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const Stamp: React.FC<{ x: number; y: number; text: string; at: number; color?: string; rotate?: number }> = ({ x, y, text, at, color = C.red, rotate = -10 }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const scale = interpolate(t, [0, 5, 9], [2.4, 0.92, 1], { extrapolateRight: "clamp" });
  const shake = t < 12 ? Math.sin(t * 2.5) * (12 - t) * 0.8 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x + shake,
        top: y,
        transform: `translate(-50%, -50%) rotate(${rotate}deg) scale(${scale})`,
        opacity: interpolate(t, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
        border: `9px solid ${color}`,
        borderRadius: 18,
        padding: "8px 30px",
        color,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: 88,
        letterSpacing: 2,
        background: "rgba(255,248,238,0.92)",
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </div>
  );
};

export const InfoCard: React.FC<{
  title: string;
  rows: Array<{ label: string; value: string; highlight?: boolean }>;
  at: number;
  top?: number;
  footnote?: string;
}> = ({ title, rows, at, top = 330, footnote }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 14);
  return (
    <div style={{ position: "absolute", top, width: "100%", display: "flex", justifyContent: "center" }}>
      <div style={{ ...card, background: "#FFF8EE", width: 900, padding: "0 0 26px", transform: `translateY(${(1 - p) * 900}px)`, overflow: "hidden" }}>
        <div style={{ background: C.orange, borderBottom: `5px solid ${INK}`, padding: "22px 36px", fontSize: 60, fontWeight: 700, color: "#FFFFFF" }}>{title}</div>
        {rows.map((r, i) => {
          const rp = interpolate(frame - at - 12 - i * 9, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 36px 0",
                fontSize: 48,
                fontWeight: r.highlight ? 700 : 500,
                color: r.highlight ? C.redDark : INK,
                opacity: rp,
                transform: `translateX(${(1 - rp) * -60}px)`,
              }}
            >
              <span>{r.label}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
            </div>
          );
        })}
        {footnote ? <div style={{ padding: "18px 36px 0", fontSize: 30, color: "#7A6F80" }}>{footnote}</div> : null}
      </div>
    </div>
  );
};

export const Inset: React.FC<{ x: number; y: number; size: number; at: number; children: React.ReactNode; label?: string }> = ({ x, y, size, at, children, label }) => {
  const p = usePop(at, 11);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${p})` }}>
      <div style={{ width: size, height: size, borderRadius: "50%", border: `8px solid ${INK}`, background: "#FFF8EE", overflow: "hidden", boxShadow: `0 10px 0 ${INK}` }}>{children}</div>
      {label ? (
        <div style={{ ...card, position: "absolute", left: "50%", bottom: -36, transform: "translateX(-50%)", background: C.orange, color: "#FFFFFF", padding: "6px 26px", fontSize: 40, fontWeight: 700, whiteSpace: "nowrap", boxShadow: `0 6px 0 ${INK}` }}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

// Untertitel Wort für Wort: aktuelles Wort orange, max. 3 Wörter sichtbar, nie über Satzgrenzen hinweg.
export const Captions: React.FC<{ words: Array<{ text: string; start: number; end: number; line: number }>; y?: number }> = ({ words, y = 1420 }) => {
  const frame = useCurrentFrame();
  const current = words.findIndex((w) => frame >= w.start && frame < w.end);
  if (current < 0) return null;
  const line = words.filter((w) => w.line === words[current].line);
  const idx = line.indexOf(words[current]);
  const groupStart = Math.floor(idx / 3) * 3;
  const group = line.slice(groupStart, groupStart + 3);
  return (
    <div style={{ position: "absolute", top: y, width: "100%", display: "flex", justifyContent: "center", gap: 22, flexWrap: "wrap", padding: "0 60px" }}>
      {group.map((w, i) => {
        const active = groupStart + i === idx;
        const past = groupStart + i < idx;
        return (
          <span
            key={w.start}
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 82,
              color: active ? C.orange : "#FFFFFF",
              opacity: active || past ? 1 : 0.55,
              WebkitTextStroke: `14px ${INK}`,
              paintOrder: "stroke fill",
              transform: `scale(${active ? 1.08 : 1})`,
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

export const SeriesTitle: React.FC<{ kicker: string; title: string; at: number; out: number }> = ({ kicker, title, at, out }) => {
  const frame = useCurrentFrame();
  const k = usePop(at, 14);
  const t = usePop(at + 8, 9);
  const o = interpolate(frame, [out, out + 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 230, width: "100%", textAlign: "center", fontFamily: FONT, opacity: o }}>
      <div style={{ fontSize: 76, fontWeight: 600, color: "#FFFFFF", WebkitTextStroke: `12px ${INK}`, paintOrder: "stroke fill", transform: `scale(${k})` }}>{kicker}</div>
      <div style={{ fontSize: 170, fontWeight: 700, color: C.orange, WebkitTextStroke: `18px ${INK}`, paintOrder: "stroke fill", lineHeight: 1.05, transform: `scale(${t}) rotate(${(1 - t) * 10 - 3}deg)` }}>
        {title}
      </div>
    </div>
  );
};

export const Poof: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 22) return null;
  const s = interpolate(t, [0, 8, 22], [0.2, 1.1, 1.3]);
  const o = interpolate(t, [0, 12, 22], [1, 1, 0]);
  return (
    <svg style={{ position: "absolute", left: x - 400, top: y - 400 }} width={800} height={800} viewBox="-400 -400 800 800">
      <g transform={`scale(${s})`} opacity={o}>
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (i / 9) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * 170} cy={Math.sin(a) * 210} r={110} fill="#FFFFFF" stroke={INK} strokeWidth={6} />;
        })}
        <circle cx={0} cy={0} r={220} fill="#FFFFFF" />
      </g>
    </svg>
  );
};
