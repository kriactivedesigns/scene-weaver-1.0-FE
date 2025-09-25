// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { CharacterModel } from '../models/character.model';
import { WorldModel } from '../models/world.model';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { CommonService } from '../services/common.service';
import { firstValueFrom, map, Observable, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RealmState {
  
  // Dependency Injection
  private readonly projectState = inject(ProjectState);
  private readonly commonService = inject(CommonService);
  private readonly http = inject(HttpClient);

  private _characters = signal<CharacterModel[]>([]);
  private _worlds = signal<WorldModel[]>([]);

  // Expose readonly signals
  readonly characters = this._characters.asReadonly();
  readonly worlds = this._worlds.asReadonly();

  readonly characterNames = computed(() => this.characters().map(c => c.name));

  async addCharacter(character: Omit<CharacterModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'imagePath'>): Promise<CharacterModel> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      const char = await firstValueFrom(this.http.post<CharacterModel>(`${environment.apiBaseUrl}/projects/${pid}/characters`, character));
      this._characters.update(chars => [...chars, char]);
      return char;
    } catch (error) {
      throw new Error("Failed to create a new Character")
    }
  }

  getCharacterById(charId: string): CharacterModel | undefined {
    return this._characters().find(c => c.id === charId)
  }
  
  async addWorld(world: Omit<WorldModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'imagePath'>): Promise<WorldModel> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      const wrld = await firstValueFrom(this.http.post<WorldModel>(`${environment.apiBaseUrl}/projects/${pid}/worlds`, world));
      this._worlds.update(wrlds => [...wrlds, wrld]);
      return wrld;
    } catch (error) {
      throw new Error("Failed to create a new world")
    }
  }

  async updateCharacter(updatedCharacter: Partial<CharacterModel>): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      const char = await firstValueFrom(this.http.put<CharacterModel>(`${environment.apiBaseUrl}/characters/${updatedCharacter.id}`, updatedCharacter));
      this._characters.update((currentChracters: Array<CharacterModel>) => {
        const index = currentChracters.findIndex(ch => ch.id == char.id);
        currentChracters[index] = char;
        return [...currentChracters];
      });
    } catch (error) {
      throw new Error("Failed to update Character")
    }
  }

  async updateWorld(updatedWorld: Partial<WorldModel>): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      const wrld = await firstValueFrom(this.http.put<WorldModel>(`${environment.apiBaseUrl}/worlds/${updatedWorld.id}`, updatedWorld));
      this._worlds.update((currentWorlds: Array<WorldModel>) => {
        const index = currentWorlds.findIndex(w => w.id == wrld.id);
        currentWorlds[index] = wrld;
        return [...currentWorlds];
      });
    } catch (error) {
      throw new Error("Failed to update World")
    }
  }

  getWorldById(worldId: string): WorldModel | undefined {
    return this._worlds().find(w => w.id === worldId)
  }

  async deleteCharacter(id: string): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/characters/${id}`));
      this._characters.update(chars => chars.filter(c => c.id != id));
    } catch (error) {
      throw new Error("Failed to delete world")
    }
  }

  async deleteWorld(id: string): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/worlds/${id}`));
      this._worlds.update(worlds => worlds.filter(w => w.id != id));
    } catch (error) {
      throw new Error("Failed to delete world")
    }
  }

  async generateCharacterImage(characterId: string, prompt: string): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      const char = await firstValueFrom(this.http.put<CharacterModel>(`${environment.apiBaseUrl}/characters/${characterId}/update-image`, { prompt: prompt }));
      this._characters.update((currentChracters: Array<CharacterModel>) => {
        const index = currentChracters.findIndex(ch => ch.id == char.id);
        currentChracters[index] = char;
        return [...currentChracters];
      });
    } catch (error) {
      throw new Error("Failed to generate character image")
    }
  }

  async generateWorldImage(worldId: string, prompt: string): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      const wrld = await firstValueFrom(this.http.put<WorldModel>(`${environment.apiBaseUrl}/worlds/${worldId}/update-image`, { prompt: prompt }));
      this._worlds.update((currentWorlds: Array<WorldModel>) => {
        const index = currentWorlds.findIndex(w => w.id == wrld.id);
        currentWorlds[index] = wrld;
        return [...currentWorlds];
      });
    } catch (error) {
      throw new Error("Failed to generate world image")
    }
  }
  
  clearWorldBible(): void {
    this._characters.set([]);
    this._worlds.set([]);
  }

  setWorlds(settings: WorldModel[]): void {
    this._worlds.set(settings);
  }

  async getCharactersByProjectId(pid: string): Promise<CharacterModel[]> {
    try {
      const characters = await firstValueFrom(
        this.http.get<Array<CharacterModel>>(`${environment.apiBaseUrl}/projects/${this.projectState.openedProject()?.id}/characters`).
          pipe(characters => characters)
      )
      this._characters.set(characters)
      return characters;
    } catch (error) {
      throw new Error('Error fetching worlds and character data')
    }
  }

  async getWorldsByProjectId(pid: string): Promise<WorldModel[]> {
    try {
      if (!this.projectState.openedProject()?.id)
        throw new Error('No Project opened.')
      
      const worlds = await firstValueFrom(
        this.http.get<Array<WorldModel>>(`${environment.apiBaseUrl}/projects/${this.projectState.openedProject()?.id}/worlds`).
          pipe(worlds => worlds)
      )
      this._worlds.set(worlds)
      return worlds
    } catch (error) {
      throw new Error('Error fetching worlds and character data')
    }
  }
  
  
}
