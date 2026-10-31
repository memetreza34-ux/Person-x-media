import { AbsoluteFill } from "remotion";
import { CostumeId, Expression2D, Max2D, PropId } from "../characters/Max2D";
import { C, FONT, INK } from "../design/theme";

const ROW: Array<{ costume: CostumeId; expression: Expression2D; prop: PropId; label: string }> = [
  { costume: "hoodie", expression: "happy", prop: "none", label: "Hoodie" },
  { costume: "baker", expression: "neutral", prop: "baguette", label: "Bäcker" },
  { costume: "suit", expression: "confused", prop: "moneybag", label: "Anzug" },
  { costume: "doctor", expression: "shocked", prop: "none", label: "Ärztin/Arzt" },
  { costume: "worker", expression: "tired", prop: "none", label: "Bau" },
];

// Charakterblatt: alle Kostüme und Ausdrücke nebeneinander, zum Prüfen der Figur.
export const MaxSheet: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {ROW.map((r, i) => (
        <g key={r.costume}>
          <Max2D x={220 + i * 370} y={900} scale={0.95} costume={r.costume} expression={r.expression} prop={r.prop} wave={i === 0 ? 1 : 0} />
          <text x={220 + i * 370} y={1010} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={44} fill={INK}>
            {r.label}
          </text>
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);
