export interface StoryThreadModel {
  id: string;              // Primary Key (UUID)
  projectId: string;         // Foreign Key to Project
  content: string;           // The text of the thread
  order: number;             // To maintain the sequence of threads
  createdAt: Date;
  updatedAt: Date;
}
