export interface WorldModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  name: string;
  imagePath: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
