import { Animatic } from "./animatics.model";
import { Character } from "./character.model";
import { ProjectMetadata } from "./project-metadata.model";
import { ScreenplayScene } from "./screenplay-scene.model";
import { StorySnippet } from "./story-snippet.model";
import { Story } from "./story.model";
import { StoryboardImage } from "./storyboard-image.model";
import { WorldSetting } from "./world-setting.model";

export interface Project extends ProjectMetadata {
  // Nested detailed entities
  characters?: Character[];
  worldSettings?: WorldSetting[];
  snippets?: StorySnippet[];                // or StorySnippet[] if you prefer
  story?: Story;
  screenplay?: ScreenplayScene[];
  storyboardImages?: StoryboardImage[];
  animatic?: Animatic;
}