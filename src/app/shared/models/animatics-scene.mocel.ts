export interface AnimaticSceneModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  sceneId: string;           // Foreign Key to ScreenplayScene
  duration: number;          // Duration in seconds at the time of generation
  aspectRatio: string;       // Aspect ratio at the time of generation
  videoPath: string;         // Path to the stored video file
  version: number;           // For tracking regenerations
  createdAt: Date;
  updatedAt: Date;
}
