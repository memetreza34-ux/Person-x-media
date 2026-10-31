import { interpolate, interpolateColors, random } from "remotion";
import { C, FONT, INK, LINE } from "../design/theme";

// Weltkoordinaten: Gehweg-Oberkante y = 1480, Max steht bei y ≈ 1550. Orte liegen entlang der x-Achse.
export const GROUND_Y = 1480;
export const WALK_Y = 1555;
export const PLACES = { home: 0, bakery: 1150, school: 2300, bank: 3450, market: 4600 } as const;

const stroke = { stroke: INK, strokeWidth: LINE, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const HOURS = [0, 4.5, 6, 8, 17, 19.5, 21, 24];
export const skyAt = (hour: number) => ({
  top: interpolateColors(hour, HOURS, ["#151A3D", "#1E2550", "#6F78C4", "#8CCBEA", "#8CCBEA", "#5D5FA8", "#1E2550", "#151A3D"]),
  bottom: interpolateColors(hour, HOURS, ["#2E2B5E", "#3A3570", "#F7B98C", "#E8F4F0", "#E8F4F0", "#F4A27A", "#3A3570", "#2E2B5E"]),
  night: interpolate(hour, HOURS, [1, 1, 0.4, 0, 0, 0.3, 1, 1]),
});

const Windows: React.FC<{ x: number; y: number; cols: number; rows: number; w: number; h: number; gapX: number; gapY: number; night: number; seed: string }> = ({
  x,
  y,
  cols,
  rows,
  w,
  h,
  gapX,
  gapY,
  night,
  seed,
}) => (
  <>
    {Array.from({ length: rows }).flatMap((_, r) =>
      Array.from({ length: cols }).map((__, c) => {
        const lit = random(`${seed}-${r}-${c}`) > 0.35;
        const glass = interpolateColors(night * (lit ? 1 : 0.15), [0, 1], ["#BFE0EE", "#FFD873"]);
        const wx = x + c * (w + gapX);
        const wy = y + r * (h + gapY);
        return (
          <g key={`${r}-${c}`}>
            <rect x={wx} y={wy} width={w} height={h} rx={10} fill={glass} {...stroke} strokeWidth={5} />
            <path d={`M ${wx + w / 2} ${wy} L ${wx + w / 2} ${wy + h} M ${wx} ${wy + h * 0.45} L ${wx + w} ${wy + h * 0.45}`} stroke={INK} strokeWidth={4} />
            <path d={`M ${wx + 10} ${wy + 12} L ${wx + 22} ${wy + 12}`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.7 * (1 - night)} />
          </g>
        );
      }),
    )}
  </>
);

const Sign: React.FC<{ x: number; y: number; text: string; bg: string; fg?: string; w: number }> = ({ x, y, text, bg, fg = "#FFFFFF", w }) => (
  <g>
    <rect x={x - w / 2} y={y - 44} width={w} height={88} rx={22} fill={bg} {...stroke} />
    <text x={x} y={y + 16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill={fg}>
      {text}
    </text>
  </g>
);

const Awning: React.FC<{ x: number; y: number; w: number; a: string; b: string }> = ({ x, y, w, a, b }) => {
  const n = 8;
  const sw = w / n;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <path
          key={i}
          d={`M ${x + i * sw} ${y} L ${x + (i + 1) * sw} ${y} L ${x + (i + 1) * sw} ${y + 70} Q ${x + (i + 0.5) * sw} ${y + 100} ${x + i * sw} ${y + 70} Z`}
          fill={i % 2 ? b : a}
        />
      ))}
      <path d={`M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + 70} ${Array.from({ length: n }).map((_, i) => `Q ${x + w - (i + 0.5) * sw} ${y + 100} ${x + w - (i + 1) * sw} ${y + 70}`).join(" ")} Z`} fill="none" {...stroke} />
    </g>
  );
};

const Door: React.FC<{ x: number; w: number; h: number; color: string }> = ({ x, w, h, color }) => (
  <g>
    <rect x={x - w / 2} y={GROUND_Y - h} width={w} height={h} rx={14} fill={color} {...stroke} />
    <rect x={x - w / 2 + 18} y={GROUND_Y - h + 22} width={w - 36} height={h * 0.38} rx={8} fill="#BFE0EE" {...stroke} strokeWidth={4} />
    <circle cx={x + w / 2 - 22} cy={GROUND_Y - h * 0.45} r={7} fill={C.gold} stroke={INK} strokeWidth={3} />
  </g>
);

const Home: React.FC<{ night: number }> = ({ night }) => {
  const x = PLACES.home;
  return (
    <g>
      <rect x={x - 380} y={GROUND_Y - 640} width={760} height={640} fill="#FFF3E2" {...stroke} />
      <path d={`M ${x - 440} ${GROUND_Y - 630} L ${x} ${GROUND_Y - 960} L ${x + 440} ${GROUND_Y - 630} Z`} fill={C.orange} {...stroke} />
      <path d={`M ${x - 380} ${GROUND_Y - 680} L ${x} ${GROUND_Y - 920} L ${x + 380} ${GROUND_Y - 680}`} fill="none" stroke={C.orangeDark} strokeWidth={10} strokeLinecap="round" />
      <rect x={x + 170} y={GROUND_Y - 1000} width={80} height={170} fill="#C9673E" {...stroke} />
      <Windows x={x - 300} y={GROUND_Y - 560} cols={2} rows={1} w={140} h={150} gapX={320} gapY={0} night={night} seed="home" />
      <circle cx={x} cy={GROUND_Y - 760} r={60} fill={interpolateColors(night, [0, 1], ["#BFE0EE", "#FFD873"])} {...stroke} />
      <Door x={x} w={170} h={290} color={C.orange} />
      <rect x={x - 300} y={GROUND_Y - 300} width={180} height={110} rx={10} fill="#BFE0EE" {...stroke} />
      <path d={`M ${x - 330} ${GROUND_Y - 195} L ${x - 90} ${GROUND_Y - 195}`} stroke={INK} strokeWidth={LINE} />
      {[-0.45, -0.3, -0.15].map((o) => (
        <circle key={o} cx={x - 210 + o * 200} cy={GROUND_Y - 205} r={22} fill={o === -0.3 ? C.red : C.green} {...stroke} strokeWidth={4} />
      ))}
      <g transform={`translate(${x + 300} ${GROUND_Y})`}>
        <rect x={-8} y={-150} width={16} height={150} fill="#7A5634" {...stroke} strokeWidth={4} />
        <rect x={-50} y={-210} width={100} height={70} rx={16} fill={C.blue} {...stroke} />
        <text x={0} y={-162} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={34} fill="#FFFFFF">
          MAX
        </text>
      </g>
    </g>
  );
};

const Bakery: React.FC<{ night: number }> = ({ night }) => {
  const x = PLACES.bakery;
  return (
    <g>
      <rect x={x - 420} y={GROUND_Y - 900} width={840} height={900} fill="#D9785B" {...stroke} />
      {Array.from({ length: 14 }).map((_, r) => (
        <path key={r} d={`M ${x - 420} ${GROUND_Y - 900 + r * 64} L ${x + 420} ${GROUND_Y - 900 + r * 64}`} stroke="#C4644A" strokeWidth={4} />
      ))}
      <rect x={x - 450} y={GROUND_Y - 935} width={900} height={50} rx={10} fill="#F6E9D6" {...stroke} />
      <Windows x={x - 330} y={GROUND_Y - 830} cols={3} rows={1} w={160} h={170} gapX={90} gapY={0} night={night} seed="bak" />
      <Sign x={x} y={GROUND_Y - 560} text="Bäckerei" bg="#7A3B2A" w={420} />
      <Awning x={x - 400} y={GROUND_Y - 500} w={800} a={C.red} b="#FFF3E2" />
      <rect x={x - 380} y={GROUND_Y - 390} width={460} height={300} rx={14} fill={interpolateColors(night, [0, 1], ["#CDE8F2", "#FFE39A"])} {...stroke} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${x - 300 + i * 150} ${GROUND_Y - 150})`}>
          <ellipse cx={0} cy={0} rx={60} ry={32} fill="#E2A458" {...stroke} strokeWidth={5} />
          <path d="M -28 -8 L -12 -24 M 0 -8 L 16 -24 M 28 -8 L 40 -20" stroke="#B9783A" strokeWidth={5} strokeLinecap="round" />
        </g>
      ))}
      <path d={`M ${x - 380} ${GROUND_Y - 110} L ${x + 80} ${GROUND_Y - 110}`} stroke={INK} strokeWidth={LINE} />
      <Door x={x + 250} w={180} h={320} color="#7A3B2A" />
      <g transform={`translate(${x + 330} ${GROUND_Y - 680})`}>
        <path d="M 0 -40 C -50 -80 -90 -10 -40 20 C -10 40 10 40 40 20 C 90 -10 50 -80 0 -40 Z" fill="#E2A458" {...stroke} strokeWidth={5} />
      </g>
    </g>
  );
};

const School: React.FC<{ night: number }> = ({ night }) => {
  const x = PLACES.school;
  return (
    <g>
      <rect x={x - 430} y={GROUND_Y - 820} width={860} height={820} fill="#E59A5C" {...stroke} />
      <path d={`M ${x - 470} ${GROUND_Y - 810} L ${x} ${GROUND_Y - 1050} L ${x + 470} ${GROUND_Y - 810} Z`} fill="#9C4A33" {...stroke} />
      <circle cx={x} cy={GROUND_Y - 900} r={70} fill="#FFFFFF" {...stroke} />
      <path d={`M ${x} ${GROUND_Y - 900} L ${x} ${GROUND_Y - 945} M ${x} ${GROUND_Y - 900} L ${x + 30} ${GROUND_Y - 885}`} stroke={INK} strokeWidth={LINE} />
      <Windows x={x - 360} y={GROUND_Y - 740} cols={4} rows={2} w={140} h={150} gapX={47} gapY={60} night={night} seed="sch" />
      <Sign x={x} y={GROUND_Y - 330} text="Schule" bg="#2E3F66" w={360} />
      <Door x={x} w={240} h={250} color="#2E3F66" />
      <rect x={x + 380} y={GROUND_Y - 1150} width={12} height={350} fill="#9AA3AD" stroke={INK} strokeWidth={4} />
      <path d={`M ${x + 392} ${GROUND_Y - 1140} L ${x + 520} ${GROUND_Y - 1100} L ${x + 392} ${GROUND_Y - 1060} Z`} fill={C.green} {...stroke} strokeWidth={5} />
    </g>
  );
};

const Bank: React.FC<{ night: number }> = ({ night }) => {
  const x = PLACES.bank;
  return (
    <g>
      <rect x={x - 420} y={GROUND_Y - 860} width={840} height={860} fill="#DCE3EA" {...stroke} />
      <path d={`M ${x - 470} ${GROUND_Y - 850} L ${x} ${GROUND_Y - 1010} L ${x + 470} ${GROUND_Y - 850} Z`} fill="#B8C4D0" {...stroke} />
      <circle cx={x} cy={GROUND_Y - 905} r={44} fill={C.gold} {...stroke} />
      <text x={x} y={GROUND_Y - 888} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#FFFFFF">€</text>
      <Sign x={x} y={GROUND_Y - 760} text="Bank" bg="#2E3F66" w={300} />
      {[-300, -150, 150, 300].map((o) => (
        <g key={o}>
          <rect x={x + o - 32} y={GROUND_Y - 660} width={64} height={620} fill="#F2F5F8" {...stroke} />
          <rect x={x + o - 46} y={GROUND_Y - 680} width={92} height={30} rx={6} fill="#F2F5F8" {...stroke} />
        </g>
      ))}
      <Windows x={x - 70} y={GROUND_Y - 640} cols={1} rows={1} w={140} h={150} gapX={0} gapY={0} night={night} seed="bank" />
      <Door x={x} w={200} h={330} color="#4A5A70" />
      <rect x={x - 460} y={GROUND_Y - 50} width={920} height={50} fill="#C9D2DB" {...stroke} />
    </g>
  );
};

const Market: React.FC<{ night: number }> = ({ night }) => {
  const x = PLACES.market;
  return (
    <g>
      <rect x={x - 430} y={GROUND_Y - 760} width={860} height={760} fill="#F3EEDF" {...stroke} />
      <Sign x={x} y={GROUND_Y - 670} text="Supermarkt" bg={C.greenDark} w={520} />
      <Awning x={x - 410} y={GROUND_Y - 590} w={820} a={C.green} b="#FFFFFF" />
      <rect x={x - 390} y={GROUND_Y - 470} width={780} height={330} rx={14} fill={interpolateColors(night, [0, 1], ["#CDE8F2", "#FFE39A"])} {...stroke} />
      {[-260, -60, 140].map((o, i) => (
        <g key={o} transform={`translate(${x + o} ${GROUND_Y - 80})`}>
          <rect x={-80} y={-70} width={160} height={70} rx={8} fill="#B07A47" {...stroke} strokeWidth={5} />
          {[-45, 0, 45].map((fx) => (
            <circle key={fx} cx={fx} cy={-80} r={24} fill={[C.red, C.yellow, C.green][i]} {...stroke} strokeWidth={4} />
          ))}
        </g>
      ))}
      <Door x={x + 330} w={150} h={300} color={C.greenDark} />
    </g>
  );
};

const Tree: React.FC<{ x: number; s?: number }> = ({ x, s = 1 }) => (
  <g transform={`translate(${x} ${GROUND_Y + 30}) scale(${s})`}>
    <rect x={-18} y={-220} width={36} height={220} rx={12} fill="#8A5A3B" {...stroke} />
    <circle cx={0} cy={-300} r={120} fill="#4C9A55" {...stroke} />
    <circle cx={-70} cy={-250} r={80} fill="#5AAE63" {...stroke} />
    <circle cx={75} cy={-245} r={78} fill="#4C9A55" {...stroke} />
    <circle cx={-30} cy={-340} r={34} fill="#6FC078" />
  </g>
);

const Lamp: React.FC<{ x: number; night: number }> = ({ x, night }) => (
  <g transform={`translate(${x} ${GROUND_Y + 60})`}>
    {night > 0.05 ? <circle cx={0} cy={-520} r={190} fill="url(#lampGlow)" opacity={night} /> : null}
    <rect x={-10} y={-500} width={20} height={500} rx={8} fill="#3B4250" {...stroke} strokeWidth={4} />
    <path d="M -40 -500 L 40 -500 L 28 -545 L -28 -545 Z" fill={interpolateColors(night, [0, 1], ["#F3F0E6", "#FFE08A"])} {...stroke} strokeWidth={5} />
    <rect x={-46} y={-560} width={92} height={18} rx={6} fill="#3B4250" {...stroke} strokeWidth={4} />
  </g>
);

const Ground: React.FC<{ from: number; to: number }> = ({ from, to }) => (
  <g>
    <rect x={from} y={GROUND_Y} width={to - from} height={110} fill="#E9D8BF" />
    {Array.from({ length: Math.ceil((to - from) / 160) }).map((_, i) => (
      <path key={i} d={`M ${from + i * 160} ${GROUND_Y} L ${from + i * 160 - 30} ${GROUND_Y + 110}`} stroke="#D7C3A6" strokeWidth={4} />
    ))}
    <rect x={from} y={GROUND_Y + 110} width={to - from} height={26} fill="#CDB89A" />
    <path d={`M ${from} ${GROUND_Y} L ${to} ${GROUND_Y} M ${from} ${GROUND_Y + 110} L ${to} ${GROUND_Y + 110} M ${from} ${GROUND_Y + 136} L ${to} ${GROUND_Y + 136}`} stroke={INK} strokeWidth={LINE} />
    <rect x={from} y={GROUND_Y + 136} width={to - from} height={700} fill="#6F7480" />
    {Array.from({ length: Math.ceil((to - from) / 220) }).map((_, i) => (
      <rect key={i} x={from + i * 220} y={GROUND_Y + 290} width={120} height={16} rx={8} fill="#F4F1E8" />
    ))}
  </g>
);

// Hintergrund mit Parallax: Hügel und Stadtsilhouette bewegen sich langsamer als die Straße.
const Backdrop: React.FC<{ camX: number; night: number }> = ({ camX, night }) => {
  const hill = interpolateColors(night, [0, 1], ["#BFE0B0", "#3D4A6E"]);
  const city = interpolateColors(night, [0, 1], ["#CFDCE6", "#4A5784"]);
  return (
    <>
      <g transform={`translate(${-camX * 0.15} 0)`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx={-2000 + i * 900} cy={GROUND_Y - 120} rx={700} ry={360} fill={hill} />
        ))}
      </g>
      <g transform={`translate(${-camX * 0.4} 0)`}>
        {Array.from({ length: 40 }).map((_, i) => {
          const h = 300 + random(`city${i}`) * 420;
          const w = 180 + random(`cityw${i}`) * 140;
          return <rect key={i} x={-2500 + i * 260} y={GROUND_Y - h} width={w} height={h} rx={10} fill={city} />;
        })}
      </g>
    </>
  );
};

const Clouds: React.FC<{ frame: number; night: number }> = ({ frame, night }) => (
  <>
    {Array.from({ length: 5 }).map((_, i) => {
      const cx = ((random(`cl${i}`) * 1400 + frame * (0.3 + i * 0.08)) % 1500) - 200;
      const cy = 180 + random(`cly${i}`) * 420;
      const s = 0.7 + random(`cls${i}`) * 0.6;
      return (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${s})`} opacity={1 - night * 0.7}>
          <ellipse cx={0} cy={0} rx={120} ry={46} fill="#FFFFFF" />
          <circle cx={-40} cy={-30} r={50} fill="#FFFFFF" />
          <circle cx={30} cy={-40} r={62} fill="#FFFFFF" />
        </g>
      );
    })}
  </>
);

export type TownProps = { camX: number; camY: number; zoom: number; hour: number; frame: number; children?: React.ReactNode };

export const Town: React.FC<TownProps> = ({ camX, camY, zoom, hour, frame, children }) => {
  const sky = skyAt(hour);
  const sunAngle = interpolate(hour, [5, 19], [Math.PI, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sunX = 540 + Math.cos(sunAngle) * 420;
  const sunY = 760 - Math.sin(sunAngle) * 520;
  const moonOpacity = sky.night;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky.top} />
          <stop offset="1" stopColor={sky.bottom} />
        </linearGradient>
        <radialGradient id="lampGlow">
          <stop offset="0" stopColor="#FFE08A" stopOpacity={0.55} />
          <stop offset="1" stopColor="#FFE08A" stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={random(`st${i}`) * 1080} cy={random(`sty${i}`) * 900} r={2 + random(`str${i}`) * 3} fill="#FFFFFF" opacity={sky.night * (0.5 + 0.5 * Math.sin(frame / 8 + i))} />
      ))}
      <circle cx={sunX} cy={sunY} r={90} fill="#FFD25A" opacity={1 - sky.night} />
      <g opacity={moonOpacity}>
        <circle cx={860} cy={300} r={80} fill="#F4F1DE" />
        <circle cx={895} cy={275} r={70} fill={sky.top} />
      </g>
      <Clouds frame={frame} night={sky.night} />
      <g transform={`translate(540 960) scale(${zoom}) translate(${-camX} ${-camY})`}>
        <g transform={`translate(${camX} 0)`}>
          <Backdrop camX={camX} night={sky.night} />
        </g>
        <Ground from={-1200} to={5800} />
        <Home night={sky.night} />
        <Bakery night={sky.night} />
        <School night={sky.night} />
        <Bank night={sky.night} />
        <Market night={sky.night} />
        {[575, 1725, 2875, 4025].map((tx, i) => (i % 2 ? <Tree key={tx} x={tx} s={0.9} /> : <Lamp key={tx} x={tx} night={sky.night} />))}
        <Tree x={-560} />
        {children}
      </g>
    </svg>
  );
};
