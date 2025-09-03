export type SnippetType = 'plot_point' | 'character_idea' | 'theme' | 'dialogue' | string;
export interface StorySnippet {
  id: string;
  projectId: string;
  snippetText: string;
  snippetType?: SnippetType;
  orderIndex?: number;
  createdAt: Date;
}