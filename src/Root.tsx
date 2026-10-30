import { Composition } from "remotion";
import { Showcase } from "./Showcase";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Showcase"
      component={Showcase}
      durationInFrames={270}
      fps={30}
      width={1080}
      height={1920}
    />
  );
};
