import { ScreenplaySceneModel } from "./screenplay-scene.model";

export interface StoryboardImageMetadataModel {
  id: string;
  projectId: string;
  aspectRatio: string;
  scene: ScreenplaySceneModel;
  prompt: string;
  imagePath: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
