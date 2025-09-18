import { AnimaticSceneModel } from "./animatics-scene.model";
import { CharacterModel } from "./character.model";
import { ProjectMetadataModel } from "./project-metadata.model";
import { ScreenplaySceneModel } from "./screenplay-scene.model";
import { StoryThreadModel } from "./story-thread.model";
import { StoryModel } from "./story.model";
import { StoryboardImageModel } from "./storyboard-image.model";
import { WorldModel } from "./world.model";

export interface ProjectModel extends ProjectMetadataModel {
  characters: CharacterModel[];
  worlds: WorldModel[];
  threads: StoryThreadModel[];
  story: StoryModel;
  screenplay: ScreenplaySceneModel[];
  storyboard: StoryboardImageModel[];
  animatics: AnimaticSceneModel[];
}
