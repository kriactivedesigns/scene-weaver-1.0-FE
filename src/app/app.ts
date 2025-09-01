import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { BaseComponent } from './shared/classes/base-component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    Header
  ]
})
export class App extends BaseComponent {

  constructor() {
    super();
    effect(() => {
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const currentPage = this.route.snapshot.firstChild?.routeConfig?.path || '';
        const { projectId } = this.route.snapshot.queryParams;
        this.globalState.setCurrentPage(currentPage);
        this.globalState.openProjectWithId(projectId)
        console.log('currentProject', this.globalState.getCurrentProject())
      })
    })
  }
  
}
