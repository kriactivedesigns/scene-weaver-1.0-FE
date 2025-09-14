export interface StoryModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  title: string;             // The title of the story
  content: string;           // The full, formatted text (e.g., Markdown)
  version: number;           // For tracking edits and regenerations
  createdAt: Date;
  updatedAt: Date;
}
