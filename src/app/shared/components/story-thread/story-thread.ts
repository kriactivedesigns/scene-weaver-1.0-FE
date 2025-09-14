import { AfterViewInit, Component, effect, ElementRef, inject, input, OnDestroy, OnInit, output, signal, ViewChild } from "@angular/core";
import { StoryThreadModel } from "../../models/story-thread.model";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, fromEvent, map, Observable, Subject, switchMap, takeUntil, tap } from "rxjs";
import { CanvasState } from "../../state/canvas.state";
import { CommonModule } from "@angular/common";
import { ClickOutsideDirective } from "../../directives/click-outside.directive";

@Component({
    selector: 'story-thread',
    templateUrl: './story-thread.html',
    styleUrl: './story-thread.scss',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ClickOutsideDirective
    ]
})
export class StoryThread implements OnInit, OnDestroy {

    private readonly canvasSatate = inject(CanvasState);
    
    data = input.required<StoryThreadModel>();
    ondelete = output<StoryThreadModel>();

    editing: boolean = false;
    saveFailed: boolean = false;
    isSaving = signal<boolean>(false);
    private contentChange$ = new Subject<string>();
    private $destroy = new Subject<void>();

    constructor() {
        effect(() => {
            if (!this.data().content) {
                this.editing = true;
            }
        })
    }

    ngOnInit(): void {
        this.contentChange$.pipe(
            debounceTime(500),
            distinctUntilChanged(),
            tap(() => this.isSaving.set(true)),
            switchMap((value: string) => this.saveThread(value)),
            takeUntil(this.$destroy)
        ).subscribe({
            next: () => {
                this.isSaving.set(false);
                this.editing = false;
            }
        })
    }

    onContentChange(event: any) {
        const value = (event.target as HTMLTextAreaElement).value;
        this.contentChange$.next(value);
    }

    editContent() {
        this.editing = true;
    }

    deleteThread() {
        this.ondelete.emit(this.data());
    }

    saveThread(value: string): Observable<boolean> {
        const updatedThread: StoryThreadModel = {
            ...this.data(),
            content: value
        }
        return this.canvasSatate.updateThread(updatedThread)
    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    onOutsideClick() {
        this.editing = false;
    }
    
}