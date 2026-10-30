import { interpolate, useCurrentFrame } from "remotion";

type Props = {
  color?: string;
  walking?: boolean;
  talking?: boolean;
  scale?: number;
};

export const Stickman: React.FC<Props> = ({
  color = "#1a1a1a",
  walking = false,
  talking = false,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const swing = walking ? Math.sin(frame / 4) * 25 : 0;
  const bob = walking ? Math.abs(Math.sin(frame / 4)) * -6 : 0;
  const mouth = talking ? interpolate(Math.sin(frame / 2), [-1, 1], [2, 10]) : 3;
  const stroke = { stroke: color, strokeWidth: 10, strokeLinecap: "round" as const, fill: "none" };

  return (
    <svg width={240 * scale} height={420 * scale} viewBox="0 0 240 420">
      <g transform={`translate(0 ${bob})`}>
        <circle cx={120} cy={70} r={45} {...stroke} />
        <circle cx={105} cy={62} r={5} fill={color} />
        <circle cx={135} cy={62} r={5} fill={color} />
        <ellipse cx={120} cy={88} rx={12} ry={mouth} fill={color} />
        <line x1={120} y1={115} x2={120} y2={250} {...stroke} />
        <line x1={120} y1={150} x2={120} y2={230} {...stroke} transform={`rotate(${swing + 35} 120 150)`} />
        <line x1={120} y1={150} x2={120} y2={230} {...stroke} transform={`rotate(${-swing - 35} 120 150)`} />
      </g>
      <line x1={120} y1={250 + bob} x2={120} y2={400} {...stroke} transform={`rotate(${swing + 12} 120 ${250 + bob})`} />
      <line x1={120} y1={250 + bob} x2={120} y2={400} {...stroke} transform={`rotate(${-swing - 12} 120 ${250 + bob})`} />
    </svg>
  );
};
