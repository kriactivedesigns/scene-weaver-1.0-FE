export interface ProjectModel  {
  id: string;              // Primary Key (UUID)
  projectName: string;
  aspectRatio: string;
  description?: string;
  visualStyle?: string;
  createdAt: Date;
  updatedAt: Date;
}
