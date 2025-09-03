// canvas.state.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { WorldBibleState } from './world-bible.state';
import { StorySnippet } from '../models/story-snippet.model';

@Injectable({ providedIn: 'root' })
export class CanvasState {
  private _snippets = signal<StorySnippet[]>([]);
  
  readonly snippets = this._snippets.asReadonly();
  readonly hasSnippets = computed(() => this.snippets().length > 0);

  addSnippet(snippet: StorySnippet): void {
    this._snippets.update(snippets => [...snippets, snippet]);
  }

  updateSnippet(id: string, updates: Partial<StorySnippet>): void {
    this._snippets.update(snippets =>
      snippets.map(s => s.id === id ? { ...s, ...updates } : s)
    );
  }

  removeSnippet(id: string): void {
    this._snippets.update(snippets => snippets.filter(s => s.id !== id));
  }

  // Compose data needed for story generation
  generateStoryData = computed(() => {
    const worldBible = inject(WorldBibleState);
    return {
      snippets: this.snippets(),
      characters: worldBible.characters(),
      worldSettings: worldBible.worldSettings(),
      visualStyle: worldBible.visualStyle()
    };
  });
}
