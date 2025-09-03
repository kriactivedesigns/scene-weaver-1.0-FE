import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { PageType } from '../types/types';
import { Pages } from '../enums/enums';
import { Project } from '../models/project.model';
import { ProjectState } from '../state/project.state';

@Injectable({ providedIn: 'root' })
export class GlobalState {
  // Dependancy Injections
  private router = inject(Router);
  private projectState = inject(ProjectState);

  // Reactive signals for state
  
  private _currentPage = signal<string>('dashboard');
  
  private _isLoading = signal<boolean>(false);
  
  // Public readonly access
  readonly currentPage = this._currentPage.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  
  constructor() {
    this.setupRouterListener();
  }

  // Navigation & Page State
  setCurrentPage(page: PageType): void {
    this._currentPage.set(page);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // Private methods
  private setupRouterListener(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event as NavigationEnd)
    ).subscribe(event => {
      this.handleRouteChange(event.url);
    });
  }

  private handleRouteChange(url: string): void {
    // Extract page and projectId from URL
    if (url.includes(`/${Pages.Realm}`)) this.setCurrentPage(Pages.Realm);
    else if (url.includes(`/${Pages.Canvas}`)) this.setCurrentPage(Pages.Canvas);
    else if (url.includes(`/${Pages.Story}`)) this.setCurrentPage(Pages.Story);
    else if (url.includes(`/${Pages.Screenplay}`)) this.setCurrentPage(Pages.Screenplay);
    else if (url.includes(`/${Pages.Storyboard}`)) this.setCurrentPage(Pages.Storyboard);
    else if (url.includes(`/${Pages.Animatics}`)) this.setCurrentPage(Pages.Animatics);
    else if (url.includes(`/${Pages.Dashboard}`)) this.setCurrentPage(Pages.Dashboard);
    else this.setCurrentPage(Pages.Login);

    // Extract projectId from query params
    const urlTree = this.router.parseUrl(url);
    const projectId = urlTree.queryParams['projectId'];
    debugger
    
    if (projectId && projectId !== this.projectState.currentProjectId()) {
      this.projectState.setCurrentProjectId(projectId);
    }
  }

}
