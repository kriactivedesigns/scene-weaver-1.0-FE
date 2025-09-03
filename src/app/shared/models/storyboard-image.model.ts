export interface StoryboardImage {
  id: string;
  sceneId: string;
  imagePath: string;
  generationPrompt?: string;
  isUserUploaded?: boolean;
  createdAt: Date;
}