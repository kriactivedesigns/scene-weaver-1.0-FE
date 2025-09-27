// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { StoryThreadModel } from '../models/story-thread.model';
import { CommonService } from '../services/common.service';
import { delay, firstValueFrom, map, Observable, of, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CanvasState {
  
  // Dependency Injection
  private readonly projectState = inject(ProjectState);
  private readonly commonService = inject(CommonService);
  private readonly http = inject(HttpClient);

  private _threads = signal<StoryThreadModel[]>([]);

  // Expose readonly signals
  readonly threads = this._threads.asReadonly();

  // Computed selectors for quick lookup
  readonly threadsMap = computed(() => {
    const thrds = this.threads();
    return thrds.reduce((map, thread) => {
      map[thread.id] = thread;
      return map;
    }, {} as Record<string, StoryThreadModel>);
  });

  async getProjectStoryThreads(): Promise<Array<StoryThreadModel>> {
    try {
      let pid = this.projectState.openedProjectId();
      if (!pid)
          throw new Error("invalid project id")
            
      const threads = await firstValueFrom(this.http.get<Array<StoryThreadModel>>(`${environment.apiBaseUrl}/projects/${pid}/storythreads`));
      this._threads.set(threads)
      return threads;
    } catch (error) {
      throw new Error('Error fetching worlds and character data')
    }
  }
  
  async addThread(thread: Omit<StoryThreadModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): Promise<StoryThreadModel> {
    try {
      let pid = this.projectState.openedProjectId();
      if (!pid)
        throw new Error("invalid project id")
      const thrd = await firstValueFrom(this.http.post<StoryThreadModel>(`${environment.apiBaseUrl}/projects/${pid}/storythreads`, thread))
      this._threads.update(thrds => [...thrds, thrd ]);
      return thrd;
    } catch (error) {
      throw new Error("Failed to create a new thread")
    }
  }

  async updateThread(updatedThread: StoryThreadModel): Promise<void> {
    try {
      let pid = this.projectState.openedProjectId();
      if (!pid)
        throw new Error("invalid project id")
      const thrd = await firstValueFrom(this.http.put<StoryThreadModel>(`${environment.apiBaseUrl}/storythreads/${updatedThread.id}`, updatedThread));
      this._threads.update((currentThreads: Array<StoryThreadModel>) => {
        const index = currentThreads.findIndex(ch => ch.id == thrd.id);
        currentThreads[index] = thrd;
        return [...currentThreads];
      });
    } catch (error) {
      throw new Error("Failed to update thread")
    }
  }

  async deleteThread(id: string): Promise<void> {
    try {
      const pid = this.projectState.openedProject()?.id;
      if (!pid)
        throw new Error("Invalid project id");
      await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/storythreads/${id}`));
      this._threads.update(thrd => thrd.filter(c => c.id != id));
    } catch (error) {
      throw new Error("Failed to delete thread")
    }
  }

}
