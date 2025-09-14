export interface ScreenplaySceneModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  sceneNumber: number;       // For ordering the scenes
  duration: number; // Duration of the scene in seconds
  content: string;           // The entire formatted scene text
  createdAt: Date;
  updatedAt: Date;
}
