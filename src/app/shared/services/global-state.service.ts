import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { PageType } from '../types/types';
import { ProjectState } from '../state/project.state';
import { Pages } from '../enums/pages';
import { LoginState } from './login-state.service';

@Injectable({ providedIn: 'root' })
export class GlobalState {
  // Dependancy Injections
  private loginState = inject(LoginState);
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

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  // Private methods
  private setupRouterListener(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => event as NavigationEnd)
      )
      .subscribe((event) => {
        this.handleRouteChange(event.url);
      });
  }

  private handleRouteChange(url: string): void {
    // Extract projectId from query params
    const urlTree = this.router.parseUrl(url);
    const projectId = urlTree.queryParams['projectId'];

    if (projectId && projectId !== this.projectState.currentProjectId()) {
      //this.projectState.setCurrentProjectId(projectId);
    }
  }

  // Navigation & Page State
  setCurrentPage(url: string): void {
    let page: string;
    if (url.includes(`/${Pages.Realm}`)) page = Pages.Realm;
    else if (url.includes(`/${Pages.Canvas}`)) page = Pages.Canvas;
    else if (url.includes(`/${Pages.Storyboard}`)) page = Pages.Storyboard;
    else if (url.includes(`/${Pages.Story}`)) page = Pages.Story;
    else if (url.includes(`/${Pages.Screenplay}`)) page = Pages.Screenplay;
    else if (url.includes(`/${Pages.Animatics}`)) page = Pages.Animatics;
    else if (url.includes(`/${Pages.Dashboard}`)) page = Pages.Dashboard;
    else page = '';

    this._currentPage.set(page);
  }
}
