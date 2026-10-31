import { loadFont } from "@remotion/google-fonts/Montserrat";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import { useLayoutEffect } from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Expression, Max3D } from "./three/Max3D";
import { blinkAt, headIdle, talkAt } from "../characters/maxMotion";
import { CamKey, cameraAt } from "./three/world/cameraPath";
import { City, MAX_SIDEWALK_Z, WorldLights } from "./three/world/City";

const { fontFamily } = loadFont("normal", { weights: ["700", "800"] });

const Z = MAX_SIDEWALK_Z;
const CAM: CamKey[] = [
  { f: 0, pos: [42, 44, 52], target: [0, 0, 0] },
  { f: 100, pos: [12, 13, 24], target: [-1, 0.5, 3] },
  { f: 160, pos: [3, 3.2, 13], target: [0, 1, Z] },
  { f: 200, pos: [0.4, 1.25, Z + 3.6], target: [0.4, 1.05, Z] },
  { f: 290, pos: [0.4, 1.25, Z + 3.3], target: [0.4, 1.05, Z] },
  { f: 360, pos: [-22, 30, 38], target: [0, 0, 0] },
];

const SUBS: Array<[number, number, string]> = [
  [20, 95, "Das ist Max."],
  [100, 175, "Max wohnt hier – im Haus mit dem orangen Dach."],
  [200, 285, "Heute testet er: 7 Tage ohne Schlaf."],
  [300, 360, "Und was dann passiert, ist verrückt."],
];

const CameraRig: React.FC<{ pos: [number, number, number]; target: [number, number, number] }> = ({ pos, target }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  }, [camera, pos, target]);
  return null;
};

const ease = { easing: Easing.inOut(Easing.cubic), extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const WorldTest: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const cam = cameraAt(frame, CAM);

  // Max kommt aus der Haustür, läuft nach rechts, dreht sich zur Kamera.
  const stepOut = interpolate(frame, [40, 60], [4.1, Z], ease);
  const x = interpolate(frame, [60, 150], [-2.4, 0.4], ease);
  const walking = frame >= 40 && frame < 150;
  const rotY = interpolate(frame, [40, 58, 62, 150, 172], [0, 0, Math.PI / 2, Math.PI / 2, 0], ease);
  const speaking = frame >= 205 && frame < 285;
  const expression: Expression = frame < 290 ? "happy" : "shocked";
  const idle = headIdle(frame);

  const sub = SUBS.find(([a, b]) => frame >= a && frame < b);
  const shockIn = spring({ frame: frame - 288, fps, config: { damping: 9 } });
  const shockOut = interpolate(frame, [320, 335], [1, 0], ease);

  return (
    <AbsoluteFill style={{ backgroundColor: "#CFE6EE" }}>
      <ThreeCanvas width={width} height={height} shadows camera={{ fov: 35, near: 0.1, far: 400, position: [40, 40, 50] }}>
        <color attach="background" args={["#CFE6EE"]} />
        <fog attach="fog" args={["#CFE6EE", 60, 160]} />
        <CameraRig pos={cam.pos} target={cam.target} />
        <WorldLights />
        <City />
        <group position={[x, 0.14, stepOut]} scale={0.6}>
          <Max3D
            rotationY={rotY}
            expression={expression}
            mouthOpen={talkAt(frame, speaking)}
            blink={blinkAt(frame, fps)}
            look={frame > 290 ? [0, 0.3] : [0, 0]}
            headNod={walking ? 0 : idle.nod}
            headTilt={walking ? 0 : idle.tilt}
            headTurn={walking ? 0 : idle.turn}
            walkPhase={frame * 0.34}
            walkAmount={walking ? 1 : interpolate(frame, [150, 158], [1, 0], ease)}
          />
        </group>
      </ThreeCanvas>

      <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", paddingTop: 260 }}>
        <div
          style={{
            fontFamily,
            fontWeight: 800,
            fontSize: 130,
            color: "#FF7A1A",
            WebkitTextStroke: "6px #1B1B1B",
            transform: `scale(${shockIn * shockOut}) rotate(-8deg)`,
          }}
        >
          WAS?!
        </div>
      </AbsoluteFill>

      {sub ? (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", top: 980 }}>
          <div
            style={{
              fontFamily,
              fontWeight: 700,
              fontSize: 50,
              color: "#FFFFFF",
              backgroundColor: "rgba(20,20,20,0.82)",
              padding: "14px 26px",
              borderRadius: 14,
              maxWidth: 860,
              textAlign: "center",
              lineHeight: 1.2,
            }}
          >
            {sub[2]}
          </div>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
