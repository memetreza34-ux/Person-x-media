import { C, INK, LINE } from "../design/theme";

export type Expression2D = "neutral" | "happy" | "shocked" | "sad" | "confused" | "tired";
export type CostumeId = "hoodie" | "baker" | "suit" | "doctor" | "worker";
export type PropId = "none" | "baguette" | "moneybag" | "phone" | "book";

type Costume = {
  top: string;
  topDark: string;
  hat?: "chef" | "top" | "hard";
  detail: "strings" | "buttons" | "tie" | "stethoscope" | "vest";
  legs?: string;
};

export const COSTUMES: Record<CostumeId, Costume> = {
  hoodie: { top: C.orange, topDark: C.orangeDark, detail: "strings" },
  baker: { top: "#FBF8F2", topDark: "#DCD5C8", hat: "chef", detail: "buttons", legs: "#4A4A55" },
  suit: { top: C.navy, topDark: "#1F2B48", hat: "top", detail: "tie", legs: "#1F2B48" },
  doctor: { top: "#FBFBFB", topDark: "#D6DCE2", detail: "stethoscope", legs: "#5C7FA6" },
  worker: { top: "#F4A51C", topDark: "#C9810C", hat: "hard", detail: "vest", legs: "#3E4E6E" },
};

type Face = { browY: number; browRot: number; smile: number; mouthBase: number; mouthW: number; eyeScale: number };
const FACES: Record<Expression2D, Face> = {
  neutral: { browY: 0, browRot: 0, smile: 0.35, mouthBase: 0, mouthW: 1, eyeScale: 1 },
  happy: { browY: -4, browRot: -6, smile: 1, mouthBase: 0.35, mouthW: 1.15, eyeScale: 0.85 },
  shocked: { browY: -16, browRot: 0, smile: 0, mouthBase: 0.9, mouthW: 0.75, eyeScale: 1.15 },
  sad: { browY: -2, browRot: 18, smile: -0.8, mouthBase: 0, mouthW: 0.9, eyeScale: 0.95 },
  confused: { browY: -6, browRot: -12, smile: -0.2, mouthBase: 0, mouthW: 0.8, eyeScale: 1 },
  tired: { browY: 4, browRot: 8, smile: -0.1, mouthBase: 0, mouthW: 0.8, eyeScale: 0.55 },
};

export type Max2DProps = {
  x: number;
  y: number;
  scale?: number;
  expression?: Expression2D;
  costume?: CostumeId;
  prop?: PropId;
  mouthOpen?: number;
  blink?: number;
  look?: [number, number];
  walkPhase?: number;
  walkAmount?: number;
  wave?: number;
  wavePhase?: number;
  point?: number;
  headTilt?: number;
  squash?: number;
};

const stroke = { stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Hat: React.FC<{ kind: Costume["hat"] }> = ({ kind }) => {
  if (kind === "chef")
    return (
      <g>
        <path d="M -95 -560 C -150 -580 -150 -680 -80 -680 C -70 -740 10 -760 30 -700 C 80 -740 160 -690 120 -620 C 150 -600 130 -560 95 -560 Z" fill="#FFFFFF" {...stroke} />
        <rect x={-100} y={-578} width={200} height={42} rx={14} fill="#F1ECE3" {...stroke} />
        <path d="M -40 -640 C -30 -660 -10 -660 0 -650 M 30 -660 C 45 -672 60 -665 66 -650" fill="none" stroke="#D9D2C6" strokeWidth={5} strokeLinecap="round" />
      </g>
    );
  if (kind === "top")
    return (
      <g>
        <rect x={-75} y={-720} width={150} height={150} rx={10} fill="#1E1B25" {...stroke} />
        <rect x={-75} y={-615} width={150} height={26} fill={C.red} />
        <ellipse cx={0} cy={-572} rx={135} ry={22} fill="#1E1B25" {...stroke} />
      </g>
    );
  if (kind === "hard")
    return (
      <g>
        <path d="M -125 -545 C -125 -660 125 -660 125 -545 Z" fill={C.yellow} {...stroke} />
        <rect x={-150} y={-560} width={300} height={30} rx={15} fill={C.yellow} {...stroke} />
        <path d="M 0 -650 L 0 -560" stroke="#E0A92A" strokeWidth={10} strokeLinecap="round" />
      </g>
    );
  return null;
};

const Prop: React.FC<{ id: PropId }> = ({ id }) => {
  if (id === "baguette")
    return (
      <g transform="rotate(-35)">
        <rect x={-22} y={-130} width={44} height={210} rx={22} fill="#E2A458" {...stroke} />
        {[-90, -45, 0, 45].map((yy) => (
          <path key={yy} d={`M -10 ${yy} L 12 ${yy - 22}`} stroke="#B9783A" strokeWidth={6} strokeLinecap="round" />
        ))}
      </g>
    );
  if (id === "moneybag")
    return (
      <g transform="translate(0 40)">
        <path d="M -55 10 C -70 70 -40 100 0 100 C 40 100 70 70 55 10 C 45 -15 25 -25 15 -30 L -15 -30 C -25 -25 -45 -15 -55 10 Z" fill="#D8B26B" {...stroke} />
        <rect x={-24} y={-44} width={48} height={18} rx={9} fill="#B58E45" {...stroke} />
        <text x={0} y={62} textAnchor="middle" fontSize={56} fontWeight={700} fill="#4E7A2E" fontFamily="sans-serif">€</text>
      </g>
    );
  if (id === "phone")
    return <rect x={-28} y={-60} width={56} height={100} rx={12} fill="#2B2B36" {...stroke} />;
  if (id === "book")
    return (
      <g>
        <rect x={-50} y={-40} width={100} height={80} rx={6} fill={C.blue} {...stroke} />
        <path d="M 0 -40 L 0 40" stroke={INK} strokeWidth={4} />
      </g>
    );
  return null;
};

const Arm: React.FC<{ side: 1 | -1; angle: number; bend: number; color: string; dark: string; prop?: PropId }> = ({ side, angle, bend, color, dark, prop }) => (
  <g transform={`translate(${side * 100} -312) rotate(${angle})`}>
    <rect x={-24} y={-10} width={48} height={96} rx={24} fill={color} {...stroke} />
    <g transform={`translate(0 76) rotate(${bend})`}>
      <rect x={-22} y={-6} width={44} height={84} rx={22} fill={color} {...stroke} />
      <rect x={-23} y={58} width={46} height={20} rx={8} fill={dark} {...stroke} />
      {prop && prop !== "none" ? (
        <g transform="translate(0 100)">
          <Prop id={prop} />
        </g>
      ) : null}
      <circle cx={0} cy={100} r={26} fill={C.skin} {...stroke} />
    </g>
  </g>
);

const Leg: React.FC<{ side: 1 | -1; angle: number; color: string }> = ({ side, angle, color }) => (
  <g transform={`translate(${side * 40} -150) rotate(${angle})`}>
    <rect x={-27} y={-10} width={54} height={134} rx={24} fill={color} {...stroke} />
    <g transform={`translate(${side * 10} 128)`}>
      <path d="M -40 8 C -40 -22 -18 -26 0 -26 C 30 -26 46 -14 46 8 Z" fill="#FFFFFF" {...stroke} />
      <path d="M -40 8 L 46 8" stroke={INK} strokeWidth={LINE} strokeLinecap="round" />
      <path d="M -36 2 L 42 2" stroke="#D9D4CB" strokeWidth={6} strokeLinecap="round" />
    </g>
  </g>
);

const Eye: React.FC<{ side: 1 | -1; look: [number, number]; open: number }> = ({ side, look, open }) => (
  <g transform={`translate(${side * 48} -468) scale(1 ${Math.max(0.06, open)})`}>
    <ellipse cx={0} cy={0} rx={25} ry={29} fill="#FFFFFF" {...stroke} strokeWidth={5} />
    <circle cx={look[0] * 8} cy={look[1] * 7 + 2} r={17} fill="#6B3E1F" />
    <circle cx={look[0] * 8} cy={look[1] * 7 + 2} r={9} fill={INK} />
    <circle cx={look[0] * 8 + 7} cy={look[1] * 7 - 6} r={5.5} fill="#FFFFFF" />
  </g>
);

const Mouth: React.FC<{ face: Face; open: number }> = ({ face, open }) => {
  const o = Math.min(1, face.mouthBase + open);
  const w = 26 * face.mouthW;
  if (o < 0.08) {
    return <path d={`M ${-w} -404 Q 0 ${-404 + 18 * face.smile} ${w} -404`} fill="none" {...stroke} />;
  }
  const h = 8 + o * 30;
  const top = -408 - (face.smile > 0.5 ? 2 : 0);
  const d =
    face.smile > 0.5
      ? `M ${-w - 4} ${top} Q 0 ${top + 4} ${w + 4} ${top} Q ${w} ${top + h * 1.5} 0 ${top + h * 1.5} Q ${-w} ${top + h * 1.5} ${-w - 4} ${top} Z`
      : `M ${-w * 0.7} ${top} C ${-w * 0.8} ${top - h * 0.6} ${w * 0.8} ${top - h * 0.6} ${w * 0.7} ${top} C ${w * 0.8} ${top + h * 1.4} ${-w * 0.8} ${top + h * 1.4} ${-w * 0.7} ${top} Z`;
  return (
    <g>
      <path d={d} fill="#5B1F22" {...stroke} strokeWidth={5} />
      {face.smile > 0.5 ? <path d={`M ${-w + 2} ${top + 3} Q 0 ${top + 9} ${w - 2} ${top + 3} L ${w - 4} ${top + 10} Q 0 ${top + 14} ${-w + 4} ${top + 10} Z`} fill="#FFFFFF" /> : null}
      <ellipse cx={0} cy={top + h * (face.smile > 0.5 ? 1.15 : 0.75)} rx={w * 0.45} ry={Math.max(3, h * 0.28)} fill="#E8706B" />
    </g>
  );
};

const Torso: React.FC<{ cos: Costume }> = ({ cos }) => (
  <g>
    <path
      d="M -96 -334 C -112 -334 -120 -306 -121 -276 L -116 -178 C -114 -152 -98 -142 -76 -142 L 76 -142 C 98 -142 114 -152 116 -178 L 121 -276 C 120 -306 112 -334 96 -334 Z"
      fill={cos.top}
      {...stroke}
    />
    <path d="M -116 -190 C -60 -176 60 -176 116 -190 L 114 -168 C 60 -154 -60 -154 -114 -168 Z" fill={cos.topDark} opacity={0.55} />
    <ellipse cx={0} cy={-332} rx={72} ry={22} fill={cos.topDark} {...stroke} />
    {cos.detail === "strings" ? (
      <g>
        <path d="M -20 -318 L -24 -262 M 20 -318 L 24 -262" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        <path d="M -64 -222 L 64 -222 L 74 -166 L -74 -166 Z" fill={cos.topDark} {...stroke} strokeWidth={5} />
      </g>
    ) : null}
    {cos.detail === "buttons" ? (
      <g>
        <path d="M -36 -326 L 0 -290 L 36 -326" fill={C.red} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        {[-290, -250, -210].map((yy) => (
          <g key={yy}>
            <circle cx={-26} cy={yy} r={8} fill="#CFC6B8" stroke={INK} strokeWidth={3} />
            <circle cx={26} cy={yy} r={8} fill="#CFC6B8" stroke={INK} strokeWidth={3} />
          </g>
        ))}
      </g>
    ) : null}
    {cos.detail === "tie" ? (
      <g>
        <path d="M -50 -330 L 0 -250 L 50 -330 Z" fill="#FFFFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 0 -322 L -14 -300 L 0 -220 L 14 -300 Z" fill={C.red} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </g>
    ) : null}
    {cos.detail === "stethoscope" ? (
      <path d="M -50 -326 C -60 -260 -30 -230 0 -230 C 30 -230 60 -260 50 -326 M 0 -230 L 0 -200" fill="none" stroke="#4A5566" strokeWidth={7} strokeLinecap="round" />
    ) : null}
    {cos.detail === "vest" ? (
      <g>
        <path d="M -116 -232 L 116 -232" stroke="#E6E6E6" strokeWidth={14} />
        <path d="M -116 -232 L 116 -232" stroke="#BFC3C8" strokeWidth={3} />
      </g>
    ) : null}
  </g>
);

export const Max2D: React.FC<Max2DProps> = ({
  x,
  y,
  scale = 1,
  expression = "neutral",
  costume = "hoodie",
  prop = "none",
  mouthOpen = 0,
  blink = 0,
  look = [0, 0],
  walkPhase = 0,
  walkAmount = 0,
  wave = 0,
  wavePhase = 0,
  point = 0,
  headTilt = 0,
  squash = 0,
}) => {
  const cos = COSTUMES[costume];
  const face = FACES[expression];
  const swing = Math.sin(walkPhase) * 20 * walkAmount;
  const bob = -Math.abs(Math.cos(walkPhase)) * 12 * walkAmount;
  const eyeOpen = face.eyeScale * (1 - blink);
  const legColor = cos.legs ?? C.navy;

  // Rechter Bildarm (+1) winkt/zeigt, linker Bildarm (-1) hält das Requisit.
  const rightAngle = -12 - wave * 118 - point * 80 + swing * 0.8;
  const rightBend = wave * (-55 + Math.sin(wavePhase) * 25) - point * 10;
  const leftAngle = 12 - swing * 0.8 + (prop !== "none" ? 10 : 0);
  const leftBend = prop !== "none" ? -35 : 6;

  return (
    <g transform={`translate(${x} ${y}) scale(${scale * (1 + squash * 0.08)} ${scale * (1 - squash * 0.1)})`}>
      <ellipse cx={0} cy={8} rx={125} ry={18} fill={INK} opacity={0.14} />
      <Leg side={-1} angle={swing} color={legColor} />
      <Leg side={1} angle={-swing} color={legColor} />
      <g transform={`translate(0 ${bob})`}>
        <Arm side={-1} angle={leftAngle} bend={leftBend} color={cos.top} dark={cos.topDark} prop={prop} />
        <Torso cos={cos} />
        <Arm side={1} angle={rightAngle} bend={rightBend} color={cos.top} dark={cos.topDark} />
        <rect x={-24} y={-370} width={48} height={44} fill={C.skinDark} {...stroke} strokeWidth={5} />
        <g transform={`rotate(${headTilt} 0 -360)`}>
          <ellipse cx={-130} cy={-458} rx={22} ry={31} fill={C.skin} {...stroke} />
          <ellipse cx={130} cy={-458} rx={22} ry={31} fill={C.skin} {...stroke} />
          <ellipse cx={0} cy={-468} rx={131} ry={124} fill={C.skin} {...stroke} />
          <path d="M -110 -410 C -80 -362 80 -362 110 -410 C 90 -380 -90 -380 -110 -410 Z" fill={C.skinDark} opacity={0.35} />
          <ellipse cx={-82} cy={-428} rx={23} ry={13} fill={C.blush} opacity={0.6} />
          <ellipse cx={82} cy={-428} rx={23} ry={13} fill={C.blush} opacity={0.6} />
          <Eye side={-1} look={look} open={eyeOpen} />
          <Eye side={1} look={look} open={eyeOpen} />
          {[-1, 1].map((s) => (
            <rect
              key={s}
              x={s * 48 - 24}
              y={-522 + face.browY}
              width={48}
              height={12}
              rx={6}
              fill={C.hair}
              transform={`rotate(${s * face.browRot} ${s * 48} ${-516 + face.browY})`}
            />
          ))}
          <ellipse cx={0} cy={-438} rx={13} ry={9} fill={C.skinDark} />
          <Mouth face={face} open={mouthOpen} />
          <path
            d="M -138 -456 C -156 -566 -84 -628 0 -626 C 92 -626 156 -566 138 -456 C 126 -496 104 -520 74 -530 C 62 -506 40 -500 18 -514 C 2 -534 -22 -538 -44 -528 C -64 -510 -88 -512 -102 -528 C -118 -508 -128 -486 -138 -456 Z"
            fill={C.hair}
            {...stroke}
          />
          {cos.hat ? null : (
            <>
              <path d="M -6 -622 C 0 -664 30 -674 46 -664 C 28 -652 24 -636 28 -616 Z" fill={C.hair} {...stroke} strokeWidth={5} />
              <path d="M -70 -590 C -40 -606 20 -610 60 -596" fill="none" stroke="#5A3A28" strokeWidth={6} strokeLinecap="round" />
            </>
          )}
          <Hat kind={cos.hat} />
        </g>
      </g>
    </g>
  );
};
