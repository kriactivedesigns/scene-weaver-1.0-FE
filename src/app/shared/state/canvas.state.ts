// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { StoryThreadModel } from '../models/story-thread.model';
import { CommonService } from '../services/common.service';
import { delay, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CanvasState {
  
  // Dependency Injection
  private projectState = inject(ProjectState);
  private commonService = inject(CommonService);

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

  constructor() {
    effect(() => {
      const threads = this.projectState.openedProject()?.threads;
      this._threads.set(threads ? threads : []);
    })
  }

  addThread(thread: Omit<StoryThreadModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>): void {
    let pid = this.projectState.openedProjectId();
    if (pid) {
      const newThread: StoryThreadModel = {
          ...thread,
          projectId: pid,
          id: this.commonService.generateId(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        this._threads.update(thrds => [...thrds, newThread ]);
        this.updateProject(pid, { threads: this._threads()});
    }
  }

  updateThread(updates: StoryThreadModel): Observable<boolean> {
    this._threads.update(thrds => 
      thrds.map(thrd => thrd.id === updates.id ? { ...thrd, ...updates } : thrd)
    );
    let pid = this.projectState.openedProjectId();
      if (pid)
      this.updateProject(pid, { threads: this._threads()});

    return of(true).pipe(delay(3000));
  }

  deleteThread(id: string): void {
    this._threads.update(threads => threads.filter(t => t.id != id));
    let pid = this.projectState.openedProjectId();
    if (pid)
      this.updateProject(pid, { threads: this._threads()});
  }

  private updateProject(id: string, updates: Partial<ProjectModel>): void {
    this.projectState.updateOpenedProject(id, updates);
  }
  
}
