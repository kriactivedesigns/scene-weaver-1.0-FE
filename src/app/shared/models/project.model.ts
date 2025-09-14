import { CharacterModel } from "./character.model";
import { ProjectMetadataModel } from "./project-metadata.model";
import { StoryThreadModel } from "./story-thread.model";
import { StoryModel } from "./story.model";
import { WorldModel } from "./world.model";

export interface ProjectModel extends ProjectMetadataModel {
  characters: CharacterModel[];
  worlds: WorldModel[];
  threads: StoryThreadModel[];
  story: StoryModel;
}
