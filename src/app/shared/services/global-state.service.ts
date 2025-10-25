import { Injectable, signal, inject, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Pages } from '../enums/pages.enum';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class GlobalState {
  // Dependancy Injections
  private httpClient = inject(HttpClient);

  // Reactive signals for state
  private _currentPage = signal<string>('dashboard');
  private _currentVersion = signal<string>('');

  // Public readonly access
  readonly currentPage = this._currentPage.asReadonly();
  readonly currentVersion = this._currentVersion.asReadonly();

  constructor() {
    this.getCurrentVersion();
  }

  private getCurrentVersion(): void {
    this.httpClient.get('version.json').subscribe((data: any) => {
        this._currentVersion.set(data.version || 'unknown');
    });
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
