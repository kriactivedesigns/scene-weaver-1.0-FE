// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Character } from '../models/character.model';
import { WorldSetting } from '../models/world-setting.model';
import { ProjectState } from './project.state';

@Injectable({ providedIn: 'root' })
export class WorldBibleState {
  
  // Dependency Injection
  private projectState = inject(ProjectState);

  private _characters = signal<Character[]>([]);
  private _worldSettings = signal<WorldSetting[]>([]);
  private _visualStyle = signal<string | null>(null);

  // Expose readonly signals
  readonly characters = this._characters.asReadonly();
  readonly worldSettings = this._worldSettings.asReadonly();
  readonly visualStyle = this._visualStyle.asReadonly();

  // Computed selectors for quick lookup
  readonly characterMap = computed(() => {
    const chars = this.characters();
    return chars.reduce((map, character) => {
      map[character.id] = character;
      return map;
    }, {} as Record<string, Character>);
  });

  readonly characterNames = computed(() => this.characters().map(c => c.characterName));

  constructor() {
    effect(() => {
      const characters = this.projectState.openedProject()?.characters;
      this._characters.set(characters ? characters : []);
    })
  }

  addCharacter(character: Character): void {
    this._characters.update(chars => [...chars, character]);
  }

  updateCharacter(id: string, updates: Partial<Character>): void {
    this._characters.update(chars =>
      chars.map(char => char.id === id ? { ...char, ...updates } : char)
    );
  }

  deleteCharacter(id: string): void {
    this._characters.update(chars => chars.filter(c => c.id != id));
  }

  setVisualStyle(style: string): void {
    this._visualStyle.set(style);
  }

  clearWorldBible(): void {
    this._characters.set([]);
    this._worldSettings.set([]);
    this._visualStyle.set(null);
  }

  setWorldSettings(settings: WorldSetting[]): void {
    this._worldSettings.set(settings);
  }
}
