export interface StoryboardImageModel {
  id: string;
  projectId: string;
  aspectRatio: string;
  sceneId: string;
  prompt: string;
  imagePath: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
