import { useMemo } from "react";
import * as THREE from "three";

export type Expression = "neutral" | "happy" | "shocked" | "confused" | "sad";

export type MaxPose = {
  expression?: Expression;
  mouthOpen?: number;
  blink?: number;
  look?: [number, number];
  headTurn?: number;
  headTilt?: number;
  headNod?: number;
  walkPhase?: number;
  walkAmount?: number;
  wave?: number;
  wavePhase?: number;
};

const COLORS = {
  skin: "#EDB892",
  blush: "#F08F7E",
  hoodie: "#FF7A1A",
  hoodieDark: "#E0600B",
  jeans: "#2E3F5C",
  hair: "#3A2316",
  shoe: "#F4F2EE",
  sole: "#C9C4BA",
  eyeWhite: "#FFFFFF",
  iris: "#6B3E1F",
  pupil: "#111111",
  mouth: "#5B1F22",
  lips: "#B85C55",
  string: "#FFFFFF",
};

type ExpressionShape = {
  browY: number;
  browInner: number;
  browTilt: [number, number];
  lidOpen: number;
  mouthW: number;
  mouthH: number;
  smile: number;
};

const EXPRESSIONS: Record<Expression, ExpressionShape> = {
  neutral: { browY: 0.2, browInner: 0, browTilt: [0, 0], lidOpen: 0, mouthW: 0.7, mouthH: 0.12, smile: 0.4 },
  happy: { browY: 0.22, browInner: -0.1, browTilt: [0, 0], lidOpen: 0.15, mouthW: 1.1, mouthH: 0.35, smile: 1 },
  shocked: { browY: 0.28, browInner: 0.15, browTilt: [0, 0], lidOpen: -0.35, mouthW: 0.75, mouthH: 1, smile: 0 },
  confused: { browY: 0.21, browInner: 0, browTilt: [0.35, -0.2], lidOpen: 0.05, mouthW: 0.6, mouthH: 0.18, smile: -0.3 },
  sad: { browY: 0.19, browInner: 0.45, browTilt: [0, 0], lidOpen: 0.3, mouthW: 0.7, mouthH: 0.15, smile: -1 },
};

const Mat: React.FC<{ color: string; roughness?: number }> = ({ color, roughness = 0.6 }) => (
  <meshStandardMaterial color={color} roughness={roughness} metalness={0} />
);

const Ball: React.FC<{
  r: number;
  color: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
  roughness?: number;
}> = ({ r, color, position, scale, rotation, roughness }) => (
  <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
    <sphereGeometry args={[r, 48, 32]} />
    <Mat color={color} roughness={roughness} />
  </mesh>
);

const Pill: React.FC<{
  r: number;
  len: number;
  color: string;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
}> = ({ r, len, color, position, scale, rotation }) => (
  <mesh position={position} scale={scale} rotation={rotation} castShadow receiveShadow>
    <capsuleGeometry args={[r, len, 12, 32]} />
    <Mat color={color} />
  </mesh>
);

const Eye: React.FC<{ side: 1 | -1; look: [number, number]; lid: number }> = ({ side, look, lid }) => {
  const lidRot = THREE.MathUtils.lerp(-0.55, Math.PI / 2 - 0.05, lid);
  return (
    <group position={[side * 0.17, 0.05, 0.4]}>
      <group scale={[1, 1.1, 0.6]}>
        <mesh castShadow>
          <sphereGeometry args={[0.12, 48, 32]} />
          <meshStandardMaterial color={COLORS.eyeWhite} emissive="#FFFFFF" emissiveIntensity={0.25} roughness={0.25} />
        </mesh>
        <mesh rotation={[lidRot, 0, 0]} castShadow>
          <sphereGeometry args={[0.128, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.55} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <group position={[look[0] * 0.035, look[1] * 0.03, 0.06]}>
        <Ball r={0.062} color={COLORS.iris} scale={[1, 1, 0.45]} roughness={0.3} />
        <Ball r={0.034} color={COLORS.pupil} position={[0, 0, 0.018]} scale={[1, 1, 0.4]} roughness={0.2} />
        <mesh position={[0.022, 0.025, 0.032]}>
          <sphereGeometry args={[0.014, 16, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
};

const Brow: React.FC<{ side: 1 | -1; shape: ExpressionShape; idx: 0 | 1 }> = ({ side, shape, idx }) => (
  <group position={[side * 0.17, shape.browY + shape.browTilt[idx] * 0.06, 0.445]} rotation={[-0.25, 0, -side * shape.browInner + shape.browTilt[idx] * -side * 0.3]}>
    <Pill r={0.026} len={0.13} color={COLORS.hair} rotation={[0, 0, Math.PI / 2]} />
  </group>
);

const Mouth: React.FC<{ shape: ExpressionShape; open: number }> = ({ shape, open }) => {
  const h = Math.max(shape.mouthH, 0.08) + open * 0.75;
  return (
    <group position={[0, -0.2, 0.44]} rotation={[-0.35, 0, 0]}>
      <Ball r={0.085} color={COLORS.mouth} scale={[shape.mouthW, h, 0.35]} roughness={0.8} />
      {Math.abs(shape.smile) > 0.2 ? (
        <mesh position={[0, shape.smile > 0 ? 0.035 : -0.07, 0.01]} rotation={[0, 0, shape.smile > 0 ? Math.PI : 0]} scale={[shape.mouthW, Math.abs(shape.smile) * 0.8, 1]} castShadow>
          <torusGeometry args={[0.085, 0.018, 12, 32, Math.PI]} />
          <Mat color={COLORS.lips} roughness={0.5} />
        </mesh>
      ) : null}
    </group>
  );
};

const Hair: React.FC = () => {
  // Wenige große, stark überlappende Strähnen statt vieler kleiner Kugeln.
  const tufts: Array<[number, number, number, number, number]> = useMemo(
    () => [
      [-0.2, 0.42, 0.24, 0.2, 0.4],
      [0.05, 0.46, 0.27, 0.21, -0.2],
      [0.26, 0.39, 0.22, 0.18, -0.5],
      [0, 0.47, 0, 0.27, 0],
      [-0.25, 0.4, -0.15, 0.22, 0.3],
      [0.25, 0.4, -0.15, 0.22, -0.3],
    ],
    [],
  );
  return (
    <group>
      <mesh rotation={[-0.5, 0, 0]} castShadow>
        <sphereGeometry args={[0.53, 48, 32, 0, Math.PI * 2, 0, 1.3]} />
        <Mat color={COLORS.hair} roughness={0.75} />
      </mesh>
      {tufts.map(([x, y, z, r, rz], i) => (
        <Ball key={i} r={r} color={COLORS.hair} position={[x, y, z]} rotation={[0, 0, rz]} scale={[1.15, 0.6, 1]} roughness={0.75} />
      ))}
      <mesh position={[0.05, 0.66, 0.02]} rotation={[0.3, 0, -0.35]} castShadow>
        <coneGeometry args={[0.05, 0.18, 16]} />
        <Mat color={COLORS.hair} roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0.64, -0.04]} rotation={[-0.2, 0, 0.45]} castShadow>
        <coneGeometry args={[0.045, 0.15, 16]} />
        <Mat color={COLORS.hair} roughness={0.8} />
      </mesh>
    </group>
  );
};

const Arm: React.FC<{ side: 1 | -1; swing: number; raise: number; forearm: number }> = ({ side, swing, raise, forearm }) => (
  <group position={[side * 0.36, 1.5, 0]} rotation={[swing, 0, side * (0.12 + raise)]}>
    <Pill r={0.095} len={0.3} color={COLORS.hoodie} position={[0, -0.2, 0]} />
    <group position={[0, -0.4, 0]} rotation={[-0.15 - Math.abs(swing) * 0.3, 0, side * forearm]}>
      <Ball r={0.093} color={COLORS.hoodie} />
      <Pill r={0.088} len={0.22} color={COLORS.hoodie} position={[0, -0.16, 0]} />
      <Pill r={0.092} len={0.02} color={COLORS.hoodieDark} position={[0, -0.3, 0]} />
      <Ball r={0.09} color={COLORS.skin} position={[0, -0.4, 0.01]} scale={[0.9, 1.1, 0.75]} />
      <Ball r={0.035} color={COLORS.skin} position={[-side * 0.07, -0.37, 0.04]} />
    </group>
  </group>
);

const Leg: React.FC<{ side: 1 | -1; swing: number }> = ({ side, swing }) => (
  <group position={[side * 0.14, 0.86, 0]} rotation={[swing, 0, 0]}>
    <Pill r={0.115} len={0.56} color={COLORS.jeans} position={[0, -0.4, 0]} />
    <group position={[0, -0.78, 0.06]}>
      <mesh castShadow receiveShadow scale={[1, 0.7, 1.6]}>
        <sphereGeometry args={[0.12, 32, 24]} />
        <Mat color={COLORS.shoe} roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.06, 0]} scale={[1.05, 0.25, 1.65]} castShadow>
        <sphereGeometry args={[0.12, 32, 16]} />
        <Mat color={COLORS.sole} roughness={0.7} />
      </mesh>
    </group>
  </group>
);

export const Max3D: React.FC<MaxPose & { position?: [number, number, number]; rotationY?: number }> = ({
  expression = "neutral",
  mouthOpen = 0,
  blink = 0,
  look = [0, 0],
  headTurn = 0,
  headTilt = 0,
  headNod = 0,
  walkPhase = 0,
  walkAmount = 0,
  wave = 0,
  wavePhase = 0,
  position = [0, 0, 0],
  rotationY = 0,
}) => {
  const shape = EXPRESSIONS[expression];
  const s = Math.sin(walkPhase) * walkAmount;
  const bob = Math.abs(Math.cos(walkPhase)) * 0.05 * walkAmount;
  const lid = Math.min(1, Math.max(0, shape.lidOpen + blink * (1 - shape.lidOpen)));
  const waveRaise = wave * 2.3;
  const waveForearm = wave * (0.6 + Math.sin(wavePhase) * 0.45);

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Leg side={-1} swing={s * 0.55} />
      <Leg side={1} swing={-s * 0.55} />
      <group position={[0, bob, 0]} rotation={[0.04 * walkAmount, 0, 0]}>
        <Pill r={0.34} len={0.42} color={COLORS.hoodie} position={[0, 1.2, 0]} scale={[1.05, 1, 0.82]} />
        <mesh position={[0, 1.04, 0.255]} rotation={[-0.12, 0, 0]} castShadow>
          <boxGeometry args={[0.4, 0.18, 0.04]} />
          <Mat color={COLORS.hoodieDark} />
        </mesh>
        <mesh position={[0, 1.58, -0.04]} rotation={[Math.PI / 2 + 0.25, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.085, 16, 40]} />
          <Mat color={COLORS.hoodie} />
        </mesh>
        <Ball r={0.22} color={COLORS.hoodieDark} position={[0, 1.6, -0.24]} scale={[1.1, 0.9, 0.6]} />
        {[-1, 1].map((d) => (
          <mesh key={d} position={[d * 0.07, 1.42, 0.27]} rotation={[-0.2, 0, d * 0.05]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
            <Mat color={COLORS.string} />
          </mesh>
        ))}
        <mesh position={[0, 1.66, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 0.16, 24]} />
          <Mat color={COLORS.skin} />
        </mesh>
        <Arm side={-1} swing={-s * 0.45} raise={waveRaise} forearm={waveForearm} />
        <Arm side={1} swing={s * 0.45} raise={0} forearm={0} />

        <group position={[0, 1.7, 0]} rotation={[headNod, headTurn, headTilt]}>
          <group position={[0, 0.45, 0]}>
            <Ball r={0.5} color={COLORS.skin} scale={[1, 0.97, 0.95]} roughness={0.55} />
            <Ball r={0.09} color={COLORS.skin} position={[-0.49, 0, 0]} scale={[0.5, 1, 0.8]} />
            <Ball r={0.09} color={COLORS.skin} position={[0.49, 0, 0]} scale={[0.5, 1, 0.8]} />
            <Ball r={0.065} color={COLORS.skin} position={[0, -0.07, 0.48]} scale={[1, 0.85, 0.9]} />
            {[-1, 1].map((d) => (
              <mesh key={d} position={[d * 0.29, -0.11, 0.39]}>
                <sphereGeometry args={[0.07, 24, 16]} />
                <meshStandardMaterial color={COLORS.blush} transparent opacity={0.35} roughness={0.8} />
              </mesh>
            ))}
            <Eye side={-1} look={look} lid={lid} />
            <Eye side={1} look={look} lid={lid} />
            <Brow side={-1} shape={shape} idx={0} />
            <Brow side={1} shape={shape} idx={1} />
            <Mouth shape={shape} open={mouthOpen} />
            <Hair />
          </group>
        </group>
      </group>
    </group>
  );
};
