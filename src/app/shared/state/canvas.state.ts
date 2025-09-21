// world-bible.state.ts
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { ProjectState } from './project.state';
import { ProjectModel } from '../models/project.model';
import { StoryThreadModel } from '../models/story-thread.model';
import { CommonService } from '../services/common.service';
import { delay, map, Observable, of, pipe } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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

  constructor() {
    effect(() => {
      // const pid = this.projectState.openedProject()?.id;
      //   if (pid) {
      //       this.getStoryThreadsByProjectId(pid).subscribe(
      //           pipe((threads: Array<StoryThreadModel>) => {
      //               this._threads.set(threads);
      //           })
      //       );
      //   }
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
    }
  }

  updateThread(updates: StoryThreadModel): Observable<boolean> {
    this._threads.update(thrds => 
      thrds.map(thrd => thrd.id === updates.id ? { ...thrd, ...updates } : thrd)
    );
    return of(true).pipe(delay(3000));
  }

  deleteThread(id: string): void {
    this._threads.update(threads => threads.filter(t => t.id != id));
  }

  private getStoryThreadsByProjectId(pid: string): Observable<Array<StoryThreadModel>> {
        return this.http.get<Array<ProjectModel>>('/mock-data/projects.json').pipe(
            map((projects: any[]) => projects.find(p => p.id === pid).threads)
          )
    }
  
}
