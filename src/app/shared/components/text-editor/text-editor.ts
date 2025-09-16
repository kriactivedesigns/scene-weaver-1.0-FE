import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, effect, inject, input, OnDestroy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { StoryModel } from "../../models/story.model";
import { FloatingPrompt } from "../floating-prompt/floating-prompt";
import { selectionPlugin } from "../../extras/selection-plugin";
import { ScreenplaySceneModel } from "../../models/screenplay-scene.model";
import { IconButton } from "../icon-button/icon-button";

@Component({
    selector: 'text-editor',
    templateUrl: './text-editor.html',
    styleUrl: './text-editor.scss',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    FloatingPrompt,
    IconButton
]
})
export class TextEditorComponent implements OnDestroy {

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
    
    // Use a Formcontrol to manage the editor's content
    contentControl = new FormControl(
        '<p>Begin writing your story imaginations here...</p>',
        [Validators.required()]
    )

    constructor() {
        effect(() => {
            const content = this.data()?.content;
            if (content)
                this.contentControl.setValue(content);
        })
    }

    // method to open AI Prompt input
    openAIPrompt(): void {

        this.editor.view.focus();
        
        const { state } = this.editor.view;
        const { from, to } = state.selection;

        if (from === to) {
            return;
        }

        const start = this.editor.view.coordsAtPos(from);
        
        this.floatingMenuPosition = {
            top: `${start.bottom + 10}px`,
            left: `${start.left}px`
        };
        this.isPromptVisible = true;
        this.cdr.markForCheck();
    }

    handlePromptSubmit(prompt: string): void {

        this.isPromptVisible = false;
        const { state, dispatch } = this.editor.view;
        const { from, to } = state.selection;
        
        if (from === to) {
            return;
        }

        const transaction = state.tr.insertText(prompt, from, to);
        
        // // Apply the transaction
        dispatch(transaction);
        this.editor.view.focus();
    }

    public getContent(): string | null {
        const storyText = this.contentControl.value;
        return storyText;
    }

    ngOnDestroy(): void {
        this.editor.destroy();
    }
    
}