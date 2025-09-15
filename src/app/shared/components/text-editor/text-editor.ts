import { CommonModule } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { StoryModel } from "../../models/story.model";
import { FloatingPrompt } from "../floating-prompt/floating-prompt";
import { selectionPlugin } from "../../extras/selection-plugin";
import { ScreenplaySceneModel } from "../../models/screenplay-scene.model";

@Component({
    selector: 'text-editor',
    templateUrl: './text-editor.html',
    styleUrl: './text-editor.scss',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FloatingPrompt
]
})
export class TextEditorComponent implements OnDestroy, AfterViewInit {

    data = input.required<StoryModel | ScreenplaySceneModel | null>();
    cdr = inject(ChangeDetectorRef);

    // Initialize editor instance
    editor: Editor = new Editor({
        plugins: [selectionPlugin()]
    });

    // Toolba config - tools to include
    toolbar: Toolbar = [
        ['bold', 'italic', 'underline'],
        ['align_left', 'align_center', 'align_right', 'align_justify']
    ]

    isPromptVisible = false;
    floatingMenuPosition = { top: '0px', left: '0px' };
    // Listener cleanup function
    private unlistenMouseUp!: () => void;
    
    // Use a Formcontrol to manage the editor's content
    contentControl = new FormControl(
        '<h2>Your Story Title</h2><p>Begin writing your story here...</p>',
        [Validators.required()]
    )

    constructor() {
        effect(() => {
            const content = this.data()?.content;
            if (content)
                this.contentControl.setValue(content);
        })
    }
    
    ngAfterViewInit(): void {
        setTimeout(() => {
            const editorDom = this.editor.view?.dom;
            if(editorDom) {
                const listener = this.handleSelectionChange.bind(this);
                editorDom.addEventListener('mouseup', listener);
                this.unlistenMouseUp = () => editorDom.removeEventListener('mouseup', listener);
            }
        }, 100)
    }

    // method to open AI Prompt input
    handleSelectionChange(): void {

        // this.editor.view.focus();
        
        // const { state } = this.editor.view;
        // const { from, to } = state.selection;

        // if (from === to) {
        //     if (this.isPromptVisible) {
        //         this.isPromptVisible = false;
        //         // 2. Tell Angular to check for changes
        //         this.cdr.markForCheck(); 
        //     }
        //     return;
        // }

        // const start = this.editor.view.coordsAtPos(from);
        
        // this.floatingMenuPosition = {
        //     top: `${start.bottom + 10}px`,
        //     left: `${start.left}px`
        // };
        // this.isPromptVisible = true;
        // this.cdr.markForCheck();
    }

    handlePromptSubmit(prompt: string): void {
        this.isPromptVisible = false;
        
        const { state, dispatch } = this.editor.view;
        const { from, to } = state.selection;
        
        // Create a transaction to replace the selected text
        const transaction = state.tr.replaceWith(from, to, state.schema.text(prompt));
        
        // Apply the transaction
        dispatch(transaction);
        this.editor.view.focus();
    }

    public getContent(): string | null {
        const storyText = this.contentControl.value;
        return storyText;
    }

    ngOnDestroy(): void {
        this.editor.destroy();
        if (this.unlistenMouseUp) {
            this.unlistenMouseUp(); // Clean up the listener
        }
    }
    
}