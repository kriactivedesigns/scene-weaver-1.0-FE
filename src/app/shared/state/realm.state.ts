// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CharacterModel } from '../models/character.model';
import { WorldModel } from '../models/world.model';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { CommonService } from '../services/common.service';

@Injectable({ providedIn: 'root' })
export class RealmState {
  
  // Dependency Injection
  private projectState = inject(ProjectState);
  private commonService = inject(CommonService);

  private _characters = signal<CharacterModel[]>([]);
  private _worlds = signal<WorldModel[]>([]);

  // Expose readonly signals
  readonly characters = this._characters.asReadonly();
  readonly worlds = this._worlds.asReadonly();

  // Computed selectors for quick lookup
  readonly characterMap = computed(() => {
    const chars = this.characters();
    return chars.reduce((map, character) => {
      map[character.id] = character;
      return map;
    }, {} as Record<string, CharacterModel>);
  });

  readonly characterNames = computed(() => this.characters().map(c => c.name));

  constructor() {
    effect(() => {
      const characters = this.projectState.openedProject()?.characters;
      this._characters.set(characters ? characters : []);
      const worlds = this.projectState.openedProject()?.worlds;
      this._worlds.set(worlds ? worlds : []);
    })
  }

  addCharacter(character: Omit<CharacterModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): void {
    const pid = this.projectState.openedProject()?.id;
    if (pid) {
      const newCharacter = {
        ...character,
        id: this.commonService.generateId(),
        projectId: pid,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this._characters.update(chars => [...chars, newCharacter]);
      this.updateProject(pid, { characters: this._characters()});
    }
  }
  
  addWorld(world: Omit<WorldModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): void {
    const pid = this.projectState.openedProject()?.id;
    if (pid) {
      const newWorld: WorldModel = {
        ...world,
        projectId: pid,
        id: this.commonService.generateId(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      this._worlds.update(wrlds => [...wrlds, newWorld]);
      this.updateProject(pid, { worlds: this._worlds()});
    }
  }

  updateCharacter(id: string, updates: Partial<CharacterModel>): void {
    this._characters.update(chars => 
      chars.map(char => char.id === id ? { ...char, ...updates } : char)
    );
    let pid = this.projectState.openedProjectId();
      if (pid)
      this.updateProject(pid, { characters: this._characters()});
  }

  updateWorld(id: string, updates: Partial<WorldModel>): void {
    this._worlds.update(worlds => 
      worlds.map(world => world.id === id ? { ...world, ...updates } : world)
    );
    let pid = this.projectState.openedProjectId();
      if (pid)
        this.updateProject(pid, { worlds: this._worlds()});
  }

  deleteCharacter(id: string): void {
    this._characters.update(chars => chars.filter(c => c.id != id));
    let pid = this.projectState.openedProjectId();
    if (pid)
      this.updateProject(pid, { characters: this._characters()});
  }

  deleteWorld(id: string): void {
    this._worlds.update(worlds => worlds.filter(w => w.id != id));
    let pid = this.projectState.openedProjectId();
    if (pid)
      this.updateProject(pid, { worlds: this._worlds()});
  }

  clearWorldBible(): void {
    this._characters.set([]);
    this._worlds.set([]);
  }

  setWorlds(settings: WorldModel[]): void {
    this._worlds.set(settings);
  }

  private updateProject(pid: string, updates: Partial<ProjectModel>): void {
    this.projectState.updateOpenedProject(pid, updates);
  }
  
}
