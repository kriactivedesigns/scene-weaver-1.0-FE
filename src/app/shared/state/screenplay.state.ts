// screenplay.state.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { WorldBibleState } from './world-bible.state';
import { ScreenplayScene } from '../models/screenplay-scene.model';
import { StoryState } from './story.state';

@Injectable({ providedIn: 'root' })
export class ScreenplayState {
  private _scenes = signal<ScreenplayScene[]>([]);

  readonly scenes = this._scenes.asReadonly();
  readonly sceneCount = computed(() => this.scenes().length);

  setScenes(scenes: ScreenplayScene[]): void {
    this._scenes.set(scenes);
  }

  updateScene(sceneId: string, updates: Partial<ScreenplayScene>): void {
    this._scenes.update(scenes =>
      scenes.map(scene => scene.id === sceneId ? { ...scene, ...updates } : scene)
    );
  }

  clearScenes(): void {
    this._scenes.set([]);
  }

  // Compose data needed for storyboard generation
  storyboardGenerationData = computed(() => {
    const worldBible = inject(WorldBibleState);
    const storyState = inject(StoryState);
    return {
      scenes: this.scenes(),
      characters: worldBible.characters(),
      worldSettings: worldBible.worldSettings(),
      visualStyle: worldBible.visualStyle(),
      storyContext: storyState.story()?.storyProse
    };
  });
}
