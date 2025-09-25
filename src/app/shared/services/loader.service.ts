import { computed, Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class LoaderService {

    private readonly _loaderCounter = signal<number>(0);
    public readonly loading = computed(() => this._loaderCounter() > 0);

    show(): void {
        this._loaderCounter.update(count => count + 1);
    }
    
    hide(): void {
        this._loaderCounter.update(count => Math.max(0, count - 1));
    }
    
}