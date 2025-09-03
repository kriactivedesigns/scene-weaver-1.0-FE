export interface ScreenplayScene {
  id: string;
  projectId: string;
  sceneNumber: number;
  scriptText: string;
  shotType?: string;
  cameraAngle?: string;
  cameraMovement?: string;
  targetDuration?: number; // seconds
  additionalNotes?: string;
  createdAt: Date;
}