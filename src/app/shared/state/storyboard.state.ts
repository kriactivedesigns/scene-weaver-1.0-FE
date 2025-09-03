// storyboard.state.ts
import { Injectable, signal } from '@angular/core';
import { StoryboardImage } from '../models/storyboard-image.model';

@Injectable({ providedIn: 'root' })
export class StoryboardState {
  private _images = signal<StoryboardImage[]>([]);

  readonly images = this._images.asReadonly();

  setImages(images: StoryboardImage[]): void {
    this._images.set(images);
  }

  updateImage(imageId: string, updates: Partial<StoryboardImage>): void {
    this._images.update(images =>
      images.map(img => img.id === imageId ? { ...img, ...updates } : img)
    );
  }

  clearImages(): void {
    this._images.set([]);
  }
}
