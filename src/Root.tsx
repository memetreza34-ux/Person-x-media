import { Composition, Folder } from "remotion";
import { Baecker } from "./episodes/Baecker";
import { MaxSheet } from "./episodes/MaxSheet";
import { MaxTest } from "./experiments/MaxTest";
import { Showcase } from "./experiments/Showcase";
import { WorldTest } from "./experiments/WorldTest";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Folgen">
        <Composition id="Baecker" component={Baecker} durationInFrames={600} fps={30} width={1080} height={1920} />
      </Folder>
      <Folder name="Figur">
        <Composition id="MaxSheet" component={MaxSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
      </Folder>
      <Folder name="Experimente">
        <Composition id="WorldTest" component={WorldTest} durationInFrames={360} fps={30} width={1080} height={1920} />
        <Composition id="MaxTest" component={MaxTest} durationInFrames={210} fps={30} width={1080} height={1920} />
        <Composition id="Showcase" component={Showcase} durationInFrames={270} fps={30} width={1080} height={1920} />
      </Folder>
    </>
  );
};
