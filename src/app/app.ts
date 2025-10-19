import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { BaseComponent } from './shared/components/base-component/base-component';
import { LoaderComponent } from './shared/components/loader/loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [
    RouterOutlet,
    Header,
    LoaderComponent
]
})
export class App extends BaseComponent {

  constructor() {
    super();
    effect(() => {
        const openedProject = this.projectState.openedProject();
        if (!openedProject) {
            this.realmState.clearRealmData();
            this.canvasState.clearCanvasData();
            this.storyState.clearStoryData();
            this.screenplayState.clearScreenplayData();
            this.storyboardState.clearStoryboardData();
            this.animaticState.clearAnimaticData();
        }
    })
  }
  
}
