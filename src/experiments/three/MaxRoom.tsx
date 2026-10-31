const Plant: React.FC<{ position: [number, number, number] }> = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[0.22, 0.17, 0.5, 32]} />
      <meshStandardMaterial color="#C8643B" roughness={0.7} />
    </mesh>
    {[
      [0, 0.75, 0, 0.3],
      [-0.18, 0.62, 0.08, 0.22],
      [0.2, 0.66, -0.05, 0.24],
      [0.05, 1.0, 0.02, 0.2],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <sphereGeometry args={[r, 32, 24]} />
        <meshStandardMaterial color={i % 2 ? "#4E9A5A" : "#3F8A4C"} roughness={0.8} />
      </mesh>
    ))}
  </group>
);

export const MaxRoom: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#E8D9C4" roughness={0.9} />
    </mesh>
    <mesh position={[0, 5, -3]} receiveShadow>
      <planeGeometry args={[30, 10]} />
      <meshStandardMaterial color="#8FCFC6" roughness={0.95} />
    </mesh>
    <mesh position={[0, 0.12, -2.98]}>
      <boxGeometry args={[30, 0.24, 0.04]} />
      <meshStandardMaterial color="#F4EEE3" roughness={0.6} />
    </mesh>
    <group position={[0.9, 2.6, -2.97]}>
      <mesh>
        <boxGeometry args={[1.3, 1.6, 0.05]} />
        <meshStandardMaterial color="#F4EEE3" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.12, 1.42]} />
        <meshStandardMaterial color="#D9F1FF" emissive="#BFE6FF" emissiveIntensity={0.35} />
      </mesh>
    </group>
    <group position={[-1.2, 2.3, -2.97]}>
      <mesh>
        <boxGeometry args={[0.7, 0.55, 0.04]} />
        <meshStandardMaterial color="#2E3F5C" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.025]}>
        <planeGeometry args={[0.58, 0.43]} />
        <meshStandardMaterial color="#FFB36B" roughness={0.8} />
      </mesh>
    </group>
    <Plant position={[-1.5, 0, -2.2]} />
  </group>
);

export const StudioLights: React.FC = () => (
  <>
    <hemisphereLight args={["#FFF4E6", "#7FA8A2", 0.9]} />
    <directionalLight
      position={[3, 6, 4]}
      intensity={2.2}
      color="#FFF1DE"
      castShadow
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-4}
      shadow-camera-right={4}
      shadow-camera-top={5}
      shadow-camera-bottom={-1}
      shadow-bias={-0.0004}
      shadow-radius={6}
    />
    <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#CFE8FF" />
    <directionalLight position={[0, 0.5, 6]} intensity={0.9} color="#FFE9D6" />
    <directionalLight position={[0, 4, -5]} intensity={1.2} color="#FFFFFF" />
  </>
);
