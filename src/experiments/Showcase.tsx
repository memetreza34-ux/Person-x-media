import { loadFont } from "@remotion/google-fonts/Montserrat";
import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { Circle, Star } from "@remotion/shapes";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Stickman } from "./Stickman";

const { fontFamily } = loadFont("normal", { weights: ["800"] });

const Title: React.FC<{ text: string; color: string }> = ({ text, color }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        fontFamily,
        fontSize: 110,
        fontWeight: 800,
        color,
        textAlign: "center",
        lineHeight: 1.05,
        transform: `scale(${s})`,
        padding: "0 80px",
      }}
    >
      {text}
    </div>
  );
};

const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [0, 60], [-300, 0], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4F1EA", justifyContent: "center", alignItems: "center", gap: 80 }}>
      <Title text="Warum lügt dein Gehirn?" color="#1a1a1a" />
      <div style={{ transform: `translateX(${x}px)` }}>
        <Stickman walking={frame < 60} talking={frame >= 60} scale={1.6} />
      </div>
    </AbsoluteFill>
  );
};

const SceneDraw: React.FC = () => {
  const frame = useCurrentFrame();
  const path = "M 100 900 L 350 600 L 600 750 L 980 250";
  const progress = interpolate(frame, [0, 50], [0, 1], { extrapolateRight: "clamp" });
  const { strokeDasharray, strokeDashoffset } = evolvePath(progress, path);
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}>
      <svg width={1080} height={1100} viewBox="0 0 1080 1100">
        <path d={path} stroke="#185FA5" strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
      </svg>
      <div style={{ position: "absolute", top: 180 }}>
        <Title text="Whiteboard-Linie" color="#185FA5" />
      </div>
    </AbsoluteFill>
  );
};

const SceneShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = new Array(40).fill(0).map((_, i) => {
    const nx = noise2D("x", i, frame / 80) * 420;
    const ny = noise2D("y", i, frame / 80) * 700;
    return <Circle key={i} radius={14} fill="#5DCAA5" style={{ position: "absolute", left: 540 + nx, top: 960 + ny }} />;
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#04342C", justifyContent: "center", alignItems: "center" }}>
      {dots}
      <div style={{ transform: `rotate(${frame * 2}deg)` }}>
        <Star points={5} innerRadius={90} outerRadius={200} fill="#FAC775" />
      </div>
      <div style={{ position: "absolute", top: 180 }}>
        <Title text="Formen + Noise" color="#ffffff" />
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120}>
        <SceneIntro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={springTiming({ config: { damping: 200 } })} />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneDraw />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
      <TransitionSeries.Sequence durationInFrames={90}>
        <SceneShapes />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
