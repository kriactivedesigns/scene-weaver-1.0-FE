// animatics.state.ts
import { Injectable, signal } from '@angular/core';
import { Animatic } from '../models/animatics.model';

@Injectable({ providedIn: 'root' })
export class AnimaticsState {
  private _animatic = signal<Animatic | null>(null);

  readonly animatic = this._animatic.asReadonly();

  setAnimatic(animatic: Animatic): void {
    this._animatic.set(animatic);
  }

  clearAnimatic(): void {
    this._animatic.set(null);
  }
}
