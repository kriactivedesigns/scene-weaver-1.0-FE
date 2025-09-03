export interface Character {
  id: string;
  projectId: string;
  characterName: string;
  appearanceDescription: string;
  personality?: string;
  voiceDescription?: string;
  portraitImagePath?: string;
  createdAt: Date;
}