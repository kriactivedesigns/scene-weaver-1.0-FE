export interface Animatic {
  id: string;
  projectId: string;
  videoPath: string;
  generationSettings?: Record<string, any>;
  createdAt: Date;
}