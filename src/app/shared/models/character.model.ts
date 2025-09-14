export interface CharacterModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  name: string;
  description: string;
  imagePath?: string;
  createdAt: Date;
  updatedAt: Date;
}
