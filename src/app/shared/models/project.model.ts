import { CharacterModel } from "./character.model";
import { ProjectMetadataModel } from "./project-metadata.model";
import { StoryThreadModel } from "./story-thread.model";
import { WorldModel } from "./world.model";

export interface ProjectModel extends ProjectMetadataModel {
  characters: CharacterModel[];
  worlds: WorldModel[];
  threads: StoryThreadModel[]
}
