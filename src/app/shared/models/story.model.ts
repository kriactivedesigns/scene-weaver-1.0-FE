export interface Story {
  id: string;
  projectId: string;
  storyProse: string;
  generationSource: 'snippets' | 'upload' | 'combined' | string;
  createdAt: Date;
}