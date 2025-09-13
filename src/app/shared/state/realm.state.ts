// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Character } from '../models/character.model';
import { World } from '../models/world.model';
import { ProjectState } from './project.state';
import { Project } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class RealmState {
  
  // Dependency Injection
  private projectState = inject(ProjectState);

  private _characters = signal<Character[]>([]);
  private _worldSettings = signal<World[]>([]);
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

  readonly characterNames = computed(() => this.characters().map(c => c.name));

  constructor() {
    effect(() => {
      const characters = this.projectState.openedProject()?.characters;
      this._characters.set(characters ? characters : []);
    })
  }

  addCharacter(character: Character): void {
    this._characters.update(chars => [...chars, character]);
    this.updateProject(character.id, { characters: this._characters()});
  }

  updateCharacter(id: string, updates: Partial<Character>): void {
    console.log(updates)
    console.log(this.characters())
    this._characters.update(chars => 
      chars.map(char => char.id === id ? { ...char, ...updates } : char)
    );
    console.log(this.characters())
    if (updates.projectId)
      this.updateProject(updates.projectId, { characters: this._characters()});
  }

  deleteCharacter(id: string): void {
    this._characters.update(chars => chars.filter(c => c.id != id));
    this.updateProject(id, { characters: this._characters()});
  }

  setVisualStyle(style: string): void {
    this._visualStyle.set(style);
  }

  clearWorldBible(): void {
    this._characters.set([]);
    this._worldSettings.set([]);
    this._visualStyle.set(null);
  }

  setWorlds(settings: World[]): void {
    this._worldSettings.set(settings);
  }

  private updateProject(id: string, updates: Partial<Project>): void {
    this.projectState.updateOpenedProject(id, updates);
  }
  
}
