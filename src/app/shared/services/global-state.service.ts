import { Injectable, signal, inject, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Pages } from '../enums/pages.enum';

@Injectable({ providedIn: 'root' })
export class GlobalState {
  // Dependancy Injections
  private router = inject(Router);

  // Reactive signals for state
  private _currentPage = signal<string>('dashboard');

  // Public readonly access
  readonly currentPage = this._currentPage.asReadonly();

  constructor() {
    this.setupRouterListener();
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
    // const urlTree = this.router.parseUrl(url);
    // const projectId = urlTree.queryParams['projectId'];

    // if (projectId && projectId !== this.projectState.currentProjectId()) {
    //   //this.projectState.setCurrentProjectId(projectId);
    // }
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
