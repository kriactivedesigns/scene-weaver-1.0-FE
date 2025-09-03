export interface Project {
  id?: string;                 // UUID or string, unique project identifier
  projectName: string;        // Human-friendly name/title of the project
  width: number;              // Width (for output, canvas, story scale, etc.)
  height: number;             // Height (same as above)
  unit: string;               // 'px', 'pt', etc.
  aspectRatio?: string;       // (Optional) e.g. "16:9", "2.39:1"
  description?: string;       // Short summary or notes for this project
  visualStyle?: string;       // Style or preset name chosen by the user
  createdAt?: Date;            // Timestamp
  updatedAt?: Date;            // Timestamp
}