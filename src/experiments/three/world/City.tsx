import { useMemo } from "react";
import { random, useCurrentFrame } from "remotion";
import { Bench, Car, House, Lamp, Person, Tree } from "./props";

// Raster: Blöcke 10×10, Straßen 3 breit → Abstand 13. Max wohnt in Block (0,0), Gehweg z ≈ 4.7.
export const PITCH = 13;
const BLOCK = 10;
const RANGE = [-2, -1, 0, 1, 2];
export const MAX_SIDEWALK_Z = 4.7;

const WALLS = ["#F3EDE2", "#EADFCB", "#F6F1EA", "#E3E7EA", "#F1E2D3"];
const ROOFS = ["#9AA3AD", "#C9673E", "#7D8793", "#B5553A", "#8C7B6B"];
const CAR_COLORS = ["#E2574C", "#3E7CB1", "#F2C14E", "#F4F4F4", "#3C3C3C"];
const SHIRTS = ["#3E7CB1", "#7A5C99", "#4C9150", "#D6584B", "#E0A040", "#30363F"];
const SKINS = ["#EDB892", "#C68A64", "#8D5A3B", "#F1C9A5"];

type Kind = "home" | "houses" | "park" | "towers" | "plaza";

const kindOf = (i: number, j: number): Kind => {
  if (i === 0 && j === 0) return "home";
  // Block gegenüber von Max bleibt flach, damit die Kamera freie Sicht hat.
  if (j === 1) return i === 0 ? "plaza" : "park";
  if (i === 1 && j === 0) return "park";
  if ((i === 2 || i === -2) && j <= -1) return "towers";
  return "houses";
};

const ResidentialLots: React.FC<{ seed: string; home?: boolean }> = ({ seed, home }) => {
  const lots: Array<[number, number]> = [
    [-2.4, 2.4],
    [2.4, 2.4],
    [-2.4, -2.4],
    [2.4, -2.4],
  ];
  return (
    <>
      {lots.map(([x, z], k) => {
        const rnd = (n: string) => random(`${seed}-${k}-${n}`);
        const isMax = home && k === 0;
        return (
          <House
            key={k}
            position={[x, 0.17, z]}
            rotationY={z > 0 ? 0 : Math.PI}
            w={isMax ? 4 : 3.2 + rnd("w") * 1.2}
            d={isMax ? 3.4 : 3 + rnd("d") * 0.8}
            h={isMax ? 3.2 : 2.6 + rnd("h") * 2.2}
            wall={isMax ? "#FFF6EA" : WALLS[Math.floor(rnd("wall") * WALLS.length)]}
            roof={isMax ? "#FF7A1A" : ROOFS[Math.floor(rnd("roof") * ROOFS.length)]}
            gable={isMax || rnd("g") > 0.25}
          />
        );
      })}
      <Tree position={[0, 0.17, 2.6]} s={0.8} />
      <Tree position={[0, 0.17, -2.6]} s={0.9} tone={1} />
    </>
  );
};

const Park: React.FC<{ seed: string }> = ({ seed }) => (
  <>
    <mesh position={[0.6, 0.18, -0.6]} receiveShadow>
      <cylinderGeometry args={[2.1, 2.1, 0.04, 40]} />
      <meshStandardMaterial color="#6FB7D6" roughness={0.2} />
    </mesh>
    {Array.from({ length: 9 }).map((_, k) => {
      const a = (k / 9) * Math.PI * 2 + random(`${seed}-a${k}`);
      const rr = 3.3 + random(`${seed}-r${k}`) * 0.8;
      return <Tree key={k} position={[Math.cos(a) * rr, 0.17, Math.sin(a) * rr]} s={0.7 + random(`${seed}-s${k}`) * 0.5} tone={k % 2} />;
    })}
    <Bench position={[-1.8, 0.17, 1.8]} rotationY={0.6} />
    <Bench position={[2.4, 0.17, 2.2]} rotationY={-0.5} />
  </>
);

const Towers: React.FC<{ seed: string }> = ({ seed }) => (
  <>
    {[
      [-2.3, -2.3],
      [2.3, 2.3],
      [2.3, -2.3],
      [-2.3, 2.3],
    ].map(([x, z], k) => {
      const h = 7 + random(`${seed}-t${k}`) * 9;
      return (
        <House
          key={k}
          position={[x, 0.17, z]}
          rotationY={z > 0 ? 0 : Math.PI}
          w={3.8}
          d={3.8}
          h={h}
          wall={k % 2 ? "#C9D3DC" : "#DCE3E8"}
          roof="#6E7884"
          gable={false}
        />
      );
    })}
  </>
);

const Plaza: React.FC = () => (
  <>
    <mesh position={[0, 0.2, 0]} receiveShadow>
      <cylinderGeometry args={[1.6, 1.8, 0.4, 32]} />
      <meshStandardMaterial color="#D8D2C6" roughness={0.8} />
    </mesh>
    <mesh position={[0, 0.42, 0]}>
      <cylinderGeometry args={[1.3, 1.3, 0.05, 32]} />
      <meshStandardMaterial color="#79C3E0" roughness={0.2} />
    </mesh>
    <Tree position={[-3.5, 0.17, 3.5]} s={0.8} />
    <Tree position={[3.5, 0.17, 3.5]} s={0.8} tone={1} />
  </>
);

const Block: React.FC<{ i: number; j: number }> = ({ i, j }) => {
  const kind = kindOf(i, j);
  const seed = `b${i}_${j}`;
  const paved = kind === "towers" || kind === "plaza";
  return (
    <group position={[i * PITCH, 0, j * PITCH]}>
      <mesh position={[0, 0.07, 0]} receiveShadow>
        <boxGeometry args={[BLOCK, 0.14, BLOCK]} />
        <meshStandardMaterial color="#D9D5CC" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <boxGeometry args={[BLOCK - 1.4, 0.04, BLOCK - 1.4]} />
        <meshStandardMaterial color={paved ? "#E6E1D7" : "#9CCB6B"} roughness={0.95} />
      </mesh>
      {kind === "home" || kind === "houses" ? <ResidentialLots seed={seed} home={kind === "home"} /> : null}
      {kind === "park" ? <Park seed={seed} /> : null}
      {kind === "towers" ? <Towers seed={seed} /> : null}
      {kind === "plaza" ? <Plaza /> : null}
      {[-1, 1].map((d) => (
        <Lamp key={d} position={[d * 4.4, 0.14, 4.4]} />
      ))}
    </group>
  );
};

const Roads: React.FC = () => {
  const span = PITCH * RANGE.length + 6;
  const lines = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((k) => k * PITCH);
  return (
    <>
      {lines.map((p) => (
        <group key={p}>
          <mesh position={[0, 0.02, p]} receiveShadow>
            <boxGeometry args={[span, 0.02, 3]} />
            <meshStandardMaterial color="#8C9199" roughness={0.95} />
          </mesh>
          <mesh position={[p, 0.021, 0]} receiveShadow>
            <boxGeometry args={[3, 0.02, span]} />
            <meshStandardMaterial color="#8C9199" roughness={0.95} />
          </mesh>
          {Array.from({ length: 30 }).map((_, k) => {
            const t = -span / 2 + 1 + k * (span / 30);
            return (
              <group key={k}>
                <mesh position={[t, 0.035, p]}>
                  <boxGeometry args={[0.9, 0.01, 0.12]} />
                  <meshStandardMaterial color="#F4F1E8" />
                </mesh>
                <mesh position={[p, 0.035, t]}>
                  <boxGeometry args={[0.12, 0.01, 0.9]} />
                  <meshStandardMaterial color="#F4F1E8" />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}
    </>
  );
};

const Traffic: React.FC = () => {
  const frame = useCurrentFrame();
  const span = PITCH * 5;
  const lanes = [
    { axis: "x", p: -0.5 * PITCH, dir: 1 },
    { axis: "x", p: -1.5 * PITCH, dir: -1 },
    { axis: "x", p: 1.5 * PITCH, dir: 1 },
    { axis: "z", p: 0.5 * PITCH, dir: -1 },
    { axis: "z", p: -0.5 * PITCH, dir: 1 },
    { axis: "z", p: -1.5 * PITCH, dir: -1 },
  ] as const;
  return (
    <>
      {lanes.flatMap((lane, li) =>
        [0, 0.5].map((off, ci) => {
          const t = (((frame * 0.12 + (off + li * 0.17) * span) % span) + span) % span - span / 2;
          const along = t * lane.dir;
          const side = lane.dir * 0.7;
          const pos: [number, number, number] = lane.axis === "x" ? [along, 0, lane.p + side] : [lane.p - side, 0, along];
          const rot = lane.axis === "x" ? (lane.dir > 0 ? 0 : Math.PI) : lane.dir > 0 ? -Math.PI / 2 : Math.PI / 2;
          return <Car key={`${li}-${ci}`} position={pos} rotationY={rot} color={CAR_COLORS[(li + ci * 2) % CAR_COLORS.length]} />;
        }),
      )}
    </>
  );
};

const Pedestrians: React.FC = () => {
  const frame = useCurrentFrame();
  const people = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, k) => ({
        block: [Math.floor(random(`pi${k}`) * 5) - 2, Math.floor(random(`pj${k}`) * 4) - 2] as const,
        edge: Math.floor(random(`pe${k}`) * 2),
        off: random(`po${k}`) * 8 - 4,
        speed: (random(`ps${k}`) * 0.02 + 0.015) * (random(`pd${k}`) > 0.5 ? 1 : -1),
        shirt: SHIRTS[k % SHIRTS.length],
        skin: SKINS[k % SKINS.length],
      })),
    [],
  );
  return (
    <>
      {people.map((p, k) => {
        // Max' eigenen Gehweg freihalten.
        if (p.block[0] === 0 && p.block[1] === 0 && p.edge === 0) return null;
        const x = ((p.off + frame * p.speed + 4.5) % 9 + 9) % 9 - 4.5;
        const z = p.edge === 0 ? 4.6 : -4.6;
        return (
          <Person
            key={k}
            position={[p.block[0] * PITCH + x, 0.14, p.block[1] * PITCH + z]}
            rotationY={p.speed > 0 ? Math.PI / 2 : -Math.PI / 2}
            color={p.shirt}
            skin={p.skin}
            phase={k}
          />
        );
      })}
    </>
  );
};

export const City: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color="#A6D27A" roughness={1} />
    </mesh>
    <Roads />
    {RANGE.flatMap((i) => RANGE.slice(0, 4).map((j) => <Block key={`${i}_${j}`} i={i} j={j} />))}
    {Array.from({ length: 40 }).map((_, k) => {
      const a = (k / 40) * Math.PI * 2;
      const r = 40 + random(`ring${k}`) * 14;
      return <Tree key={k} position={[Math.cos(a) * r, 0, Math.sin(a) * r]} s={1.2 + random(`rs${k}`) * 0.8} tone={k % 2} />;
    })}
    <Traffic />
    <Pedestrians />
  </group>
);

export const WorldLights: React.FC = () => (
  <>
    <hemisphereLight args={["#FFF6E8", "#86A97A", 1.0]} />
    <directionalLight
      position={[25, 40, 18]}
      intensity={2.4}
      color="#FFF2DD"
      castShadow
      shadow-mapSize-width={4096}
      shadow-mapSize-height={4096}
      shadow-camera-left={-45}
      shadow-camera-right={45}
      shadow-camera-top={45}
      shadow-camera-bottom={-45}
      shadow-camera-near={1}
      shadow-camera-far={120}
      shadow-bias={-0.0005}
    />
    <directionalLight position={[-20, 15, 30]} intensity={0.7} color="#DCEBFF" />
  </>
);
