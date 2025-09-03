// story.state.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { WorldBibleState } from './world-bible.state';
import { Story } from '../models/story.model';

@Injectable({ providedIn: 'root' })
export class StoryState {
  private _story = signal<Story | null>(null);

  readonly story = this._story.asReadonly();
  readonly hasStory = computed(() => this.story() !== null);

  setStory(story: Story): void {
    this._story.set(story);
  }

  clearStory(): void {
    this._story.set(null);
  }

  // Compose data needed for screenplay generation
  screenplayGenerationData = computed(() => {
    const worldBible = inject(WorldBibleState);
    return {
      storyProse: this.story()?.storyProse,
      characters: worldBible.characters(),
      worldSettings: worldBible.worldSettings()
    };
  });
}
