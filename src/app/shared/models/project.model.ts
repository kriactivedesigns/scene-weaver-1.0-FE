import { Character } from "./character.model";
import { ProjectMetadata } from "./project-metadata.model";
import { World } from "./world.model";

export interface Project extends ProjectMetadata {
  characters: Character[];
  worlds: World[];
}
