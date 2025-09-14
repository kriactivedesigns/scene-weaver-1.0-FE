export interface StoryboardImageModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  aspectRatio: string;
  sceneId: string;           // Foreign Key to ScreenplayScene
  prompt: string;            // The fully constructed text prompt sent to the AI
  imagePath: string;         // Path to the stored image file
  version: number;           // For tracking regenerations
  createdAt: Date;
  updatedAt: Date;
}
