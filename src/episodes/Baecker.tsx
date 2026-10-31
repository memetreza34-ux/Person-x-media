import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { CostumeId, Expression2D, Max2D } from "../characters/Max2D";
import { blinkAt, talkAt } from "../characters/maxMotion";
import { C, FONT, INK } from "../design/theme";
import { Captions, ClockBadge, InfoCard, Inset, Poof, SeriesTitle, Stamp, Tag } from "../ui/Overlays";
import { PLACES, Town, WALK_Y } from "../world2d/Town";

const ease = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const MAX_SCALE = 0.85;

// Sätze → Wörter mit gleichmäßig verteilten Frames (bis echte Whisper-Zeiten aus der Sprachaufnahme kommen).
const LINES: Array<[number, number, string]> = [
  [95, 160, "Es ist 3:30 Uhr nachts."],
  [160, 215, "Max ist heute Bäcker."],
  [235, 335, "Bis 6 Uhr backt er 1.200 Brötchen."],
  [345, 430, "Aber was verdient er an einem?"],
  [440, 480, "Nur 4 Cent."],
  [500, 590, "Würdest du um 3:30 aufstehen?"],
];
const WORDS = LINES.flatMap(([a, b, s], line) => {
  const parts = s.split(" ");
  const step = (b - a) / parts.length;
  return parts.map((text, i) => ({ text, line, start: Math.round(a + i * step), end: Math.round(a + (i + 1) * step) }));
});
const speakingAt = (f: number) => LINES.some(([a, b]) => f >= a && f < b - 4);

export const Baecker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const maxX = interpolate(frame, [100, 220], [PLACES.home - 40, PLACES.bakery - 120], ease);
  const walking = frame >= 100 && frame < 220;
  const camX = interpolate(frame, [0, 100, 220, 240, 480, 560], [0, 0, PLACES.bakery - 120, PLACES.bakery - 60, PLACES.bakery - 60, PLACES.bakery - 60], ease);
  const camY = interpolate(frame, [0, 220, 240, 340, 360, 480, 560], [1120, 1120, 1210, 1210, 1050, 1050, 1080], ease);
  const zoom = interpolate(frame, [0, 220, 240, 340, 360, 480, 560], [0.95, 0.95, 1.25, 1.25, 1.0, 1.0, 0.9], ease);
  const hour = interpolate(frame, [0, 100, 220, 340, 480, 580], [3.5, 3.5, 3.95, 4.4, 5.0, 7.0], ease);

  const costume: CostumeId = frame < 60 ? "hoodie" : "baker";
  const expression: Expression2D =
    frame < 60 ? "happy" : frame < 220 ? "tired" : frame < 430 ? "neutral" : frame < 490 ? "shocked" : "happy";

  const toScreen = (wx: number, wy: number) => ({ x: 540 + (wx - camX) * zoom, y: 960 + (wy - camY) * zoom });
  const maxScreen = toScreen(maxX, WALK_Y - 280 * MAX_SCALE);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <Town camX={camX} camY={camY} zoom={zoom} hour={hour} frame={frame}>
        <Max2D
          x={maxX}
          y={WALK_Y}
          scale={MAX_SCALE}
          costume={costume}
          expression={expression}
          prop={frame >= 235 ? "baguette" : "none"}
          mouthOpen={talkAt(frame, speakingAt(frame))}
          blink={blinkAt(frame, fps)}
          look={frame >= 440 && frame < 490 ? [0, -0.4] : [0, 0]}
          walkPhase={frame * 0.32}
          walkAmount={walking ? 1 : 0}
          wave={interpolate(frame, [12, 20, 46, 54], [0, 1, 1, 0], ease)}
          wavePhase={frame * 0.5}
          squash={interpolate(frame, [440, 446, 456], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </Town>

      <SeriesTitle kicker="24 Stunden als" title="Bäcker." at={8} out={86} />
      <Poof x={maxScreen.x} y={maxScreen.y} at={52} />
      {frame >= 90 && (frame < 355 || frame >= 495) ? <ClockBadge hour={hour} at={frame >= 495 ? 495 : 90} /> : null}

      {frame >= 250 && frame < 340 ? <Tag x={270} y={1290} text="Ofen: 230 °C" at={250} color={C.red} textColor="#FFFFFF" /> : null}
      {frame >= 270 && frame < 340 ? (
        <Inset x={850} y={1150} size={260} at={270} label="pro Nacht">
          <svg viewBox="-150 -150 300 300" width="100%" height="100%">
            <rect x={-150} y={-150} width={300} height={300} fill="#FFE39A" />
            {[-60, 0, 60].map((bx, i) => (
              <ellipse key={bx} cx={bx} cy={-20 + (i % 2) * 40} rx={52} ry={30} fill="#E2A458" stroke={INK} strokeWidth={6} />
            ))}
            <text x={0} y={110} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={64} fill={INK}>
              1.200
            </text>
          </svg>
        </Inset>
      ) : null}

      {frame >= 355 && frame < 495 ? (
        <InfoCard
          at={355}
          top={210}
          title="1 Brötchen = 0,60 €"
          rows={[
            { label: "Mehl & Zutaten", value: "0,12 €" },
            { label: "Energie", value: "0,09 €" },
            { label: "Lohn", value: "0,22 €" },
            { label: "Miete & Laden", value: "0,09 €" },
            { label: "Steuern", value: "0,04 €" },
            { label: "Gewinn", value: "0,04 €", highlight: true },
          ]}
          footnote="Beispielrechnung, gerundet"
        />
      ) : null}
      {frame >= 440 && frame < 495 ? <Stamp x={640} y={915} text="NUR 4 CENT!" at={440} rotate={-7} /> : null}

      {frame >= 520 ? <Tag x={540} y={300} text="Schreib's in die Kommentare" at={520} color={C.orange} textColor="#FFFFFF" /> : null}

      <Captions words={WORDS} y={1600} />
    </AbsoluteFill>
  );
};
