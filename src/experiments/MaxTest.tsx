import { loadFont } from "@remotion/google-fonts/Montserrat";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Expression, Max3D } from "./three/Max3D";
import { blinkAt, headIdle, talkAt } from "../characters/maxMotion";
import { MaxRoom, StudioLights } from "./three/MaxRoom";

const { fontFamily } = loadFont("normal", { weights: ["800"] });

const CameraRig: React.FC<{ z: number; y: number }> = ({ z, y }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(0, y, z);
    // Ziel über der Kamera: Max sitzt im unteren Bildteil, oben bleibt Platz für Text.
    camera.lookAt(0, 1.95, 0);
    camera.updateProjectionMatrix();
  }, [camera, y, z]);
  return null;
};

const ease = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const MaxTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const x = interpolate(frame, [0, 55], [-2.2, 0], ease);
  const walking = frame < 55;
  const rotY = interpolate(frame, [0, 50, 62], [Math.PI / 2, Math.PI / 2, 0], ease);
  const wave = interpolate(frame, [62, 70, 95, 103], [0, 1, 1, 0], ease);
  const speaking = (frame >= 100 && frame < 150) || (frame >= 168 && frame < 200);
  const expression: Expression = frame < 100 ? "happy" : frame < 160 ? "neutral" : "shocked";
  const idle = headIdle(frame);

  const camZ = interpolate(frame, [0, 200], [7.8, 7.0], ease);
  const camY = interpolate(frame, [0, 200], [1.5, 1.65], ease);

  const titleIn = spring({ frame: frame - 100, fps, config: { damping: 14 } });
  const shockIn = spring({ frame: frame - 160, fps, config: { damping: 9 } });

  return (
    <AbsoluteFill style={{ backgroundColor: "#8FCFC6" }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 32, position: [0, 1.6, 7] }}>
        <color attach="background" args={["#8FCFC6"]} />
        <CameraRig z={camZ} y={camY} />
        <StudioLights />
        <MaxRoom />
        <Max3D
          position={[x, 0, 0]}
          rotationY={rotY}
          expression={expression}
          mouthOpen={talkAt(frame, speaking)}
          blink={blinkAt(frame, fps)}
          look={frame > 160 ? [0, 0.3] : [idle.turn * 3, 0]}
          headNod={walking ? 0 : idle.nod}
          headTilt={walking ? 0 : idle.tilt}
          headTurn={walking ? 0 : idle.turn}
          walkPhase={frame * 0.32}
          walkAmount={walking ? 1 : interpolate(frame, [55, 62], [1, 0], ease)}
          wave={wave}
          wavePhase={frame * 0.45}
        />
      </ThreeCanvas>
      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 130 }}>
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 84,
            lineHeight: 1.05,
            color: "#1B1B1B",
            textAlign: "center",
            padding: "0 70px",
            transform: `scale(${titleIn})`,
          }}
        >
          Was passiert, wenn du <span style={{ color: "#FF7A1A" }}>7 Tage</span> nicht schläfst?
        </div>
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 110,
            color: "#FF7A1A",
            WebkitTextStroke: "5px #1B1B1B",
            marginTop: 10,
            marginLeft: 420,
            transform: `scale(${shockIn}) rotate(-8deg)`,
          }}
        >
          WAS?!
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
