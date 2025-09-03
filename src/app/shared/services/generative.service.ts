import { inject, Injectable } from "@angular/core";
import { WorldBibleState } from "../state/world-bible.state";
import { CanvasState } from "../state/canvas.state";
import { StoryState } from "../state/story.state";
import { ScreenplayState } from "../state/screenplay.state";
import { Story } from "../models/story.model";
import { HttpClient } from "@angular/common/http";
import { StoryboardImage } from "../models/storyboard-image.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GenerationService {
  constructor(
    private worldBible: WorldBibleState,
    private canvas: CanvasState,
    private story: StoryState,
    private screenplay: ScreenplayState
  ) {}

  private http = inject(HttpClient);
  
  // Story Generation: Combines snippets + world bible
  async generateStory(projectId: string): Promise<Observable<Story>> {
    const generationData = {
      projectId,
      snippets: this.canvas.snippets(),
      characters: this.worldBible.characters(),
      worldSettings: this.worldBible.worldSettings(),
      visualStyle: this.worldBible.visualStyle()
    };

    return this.http.post<Story>(`/api/projects/${projectId}/generate-story`, generationData);
  }

  // Storyboard Generation: Uses ALL upstream data for consistency
  async generateStoryboard(projectId: string): Promise<Observable<StoryboardImage[]>> {
    const generationData = {
      projectId,
      scenes: this.screenplay.scenes(),
      characters: this.worldBible.characters(), // Ensures same character appearance
      worldSettings: this.worldBible.worldSettings(),
      visualStyle: this.worldBible.visualStyle(),
      storyContext: this.story.story()?.storyProse // For narrative consistency
    };

    return this.http.post<StoryboardImage[]>(`/api/projects/${projectId}/generate-storyboard`, generationData);
  }
}
