import { useCurrentFrame } from "remotion";

type V3 = [number, number, number];

const Box: React.FC<{ size: V3; position?: V3; color: string; rotation?: V3; roughness?: number }> = ({ size, position, color, rotation, roughness = 0.85 }) => (
  <mesh position={position} rotation={rotation} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={roughness} />
  </mesh>
);

export type HouseProps = {
  position: V3;
  rotationY?: number;
  w: number;
  d: number;
  h: number;
  wall: string;
  roof: string;
  gable?: boolean;
};

// Haus mit Satteldach (Dreiecksprisma) oder Flachdach; Front zeigt nach +z.
export const House: React.FC<HouseProps> = ({ position, rotationY = 0, w, d, h, wall, roof, gable = true }) => {
  const floors = Math.max(1, Math.round(h / 1.6));
  const cols = Math.max(2, Math.round(w / 1.3));
  const r = (d / 1.732) * 1.12;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <Box size={[w, h, d]} position={[0, h / 2, 0]} color={wall} />
      {gable ? (
        <mesh position={[0, h + 0.5 * r * 0.75, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.75, 1, 1]} castShadow receiveShadow>
          <cylinderGeometry args={[r, r, w + 0.3, 3, 1, false, Math.PI / 2]} />
          <meshStandardMaterial color={roof} roughness={0.8} flatShading />
        </mesh>
      ) : (
        <Box size={[w + 0.15, 0.2, d + 0.15]} position={[0, h + 0.1, 0]} color={roof} />
      )}
      {Array.from({ length: floors }).flatMap((_, f) =>
        Array.from({ length: cols }).map((__, c) => {
          const x = -w / 2 + (w / cols) * (c + 0.5);
          const y = 0.95 + f * 1.6;
          if (f === 0 && c === Math.floor(cols / 2)) return <Box key={`${f}-${c}`} size={[0.55, 1.1, 0.06]} position={[x, 0.55, d / 2 + 0.02]} color="#5A3B2A" />;
          return <Box key={`${f}-${c}`} size={[0.5, 0.6, 0.06]} position={[x, y, d / 2 + 0.02]} color="#2F3A4A" roughness={0.3} />;
        }),
      )}
    </group>
  );
};

export const Tree: React.FC<{ position: V3; s?: number; tone?: number }> = ({ position, s = 1, tone = 0 }) => (
  <group position={position} scale={s}>
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.16, 1, 8]} />
      <meshStandardMaterial color="#7A5634" roughness={0.9} />
    </mesh>
    <mesh position={[0, 1.45, 0]} castShadow>
      <icosahedronGeometry args={[0.75, 1]} />
      <meshStandardMaterial color={tone ? "#5FA35A" : "#4C9150"} roughness={0.9} flatShading />
    </mesh>
  </group>
);

export const Car: React.FC<{ position: V3; rotationY: number; color: string }> = ({ position, rotationY, color }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <Box size={[1.9, 0.45, 0.95]} position={[0, 0.42, 0]} color={color} roughness={0.5} />
    <Box size={[1.0, 0.38, 0.85]} position={[-0.1, 0.83, 0]} color="#DDE6EE" roughness={0.3} />
    {[
      [0.62, 0.45],
      [-0.62, 0.45],
      [0.62, -0.45],
      [-0.62, -0.45],
    ].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.2, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.15, 16]} />
        <meshStandardMaterial color="#222" roughness={0.9} />
      </mesh>
    ))}
  </group>
);

// Einfache Passanten im gleichen Spielzeug-Stil wie Max, aber ohne Gesicht.
export const Person: React.FC<{ position: V3; rotationY?: number; color: string; skin: string; phase?: number; walking?: boolean }> = ({
  position,
  rotationY = 0,
  color,
  skin,
  phase = 0,
  walking = true,
}) => {
  const frame = useCurrentFrame();
  const bob = walking ? Math.abs(Math.sin(frame * 0.3 + phase)) * 0.06 : 0;
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <group position={[0, bob, 0]}>
        <mesh position={[0, 0.62, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.5, 8, 16]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.25, 0]} castShadow>
          <sphereGeometry args={[0.21, 24, 16]} />
          <meshStandardMaterial color={skin} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
};

export const Bench: React.FC<{ position: V3; rotationY?: number }> = ({ position, rotationY = 0 }) => (
  <group position={position} rotation={[0, rotationY, 0]}>
    <Box size={[1.4, 0.08, 0.4]} position={[0, 0.45, 0]} color="#A86F3E" />
    <Box size={[1.4, 0.35, 0.06]} position={[0, 0.68, -0.18]} color="#A86F3E" />
    <Box size={[0.08, 0.45, 0.35]} position={[-0.6, 0.22, 0]} color="#444" />
    <Box size={[0.08, 0.45, 0.35]} position={[0.6, 0.22, 0]} color="#444" />
  </group>
);

export const Lamp: React.FC<{ position: V3 }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 1.4, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.07, 2.8, 8]} />
      <meshStandardMaterial color="#3B4250" roughness={0.6} />
    </mesh>
    <mesh position={[0, 2.85, 0]}>
      <sphereGeometry args={[0.17, 16, 12]} />
      <meshStandardMaterial color="#FFF3C4" emissive="#FFE08A" emissiveIntensity={0.4} />
    </mesh>
  </group>
);
