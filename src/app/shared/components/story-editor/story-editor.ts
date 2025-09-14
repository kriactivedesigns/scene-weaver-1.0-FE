import { CommonModule } from "@angular/common";
import { Component, effect, input, OnDestroy } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Editor, NgxEditorModule, Toolbar, Validators } from 'ngx-editor';
import { IconButton } from "../icon-button/icon-button";
import { StoryModel } from "../../models/story.model";

@Component({
    selector: 'story-editor',
    templateUrl: './story-editor.html',
    styleUrl: './story-editor.scss',
    standalone: true,
    imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxEditorModule,
    IconButton
]
})
export class StoryEditor implements OnDestroy {

    data = input.required<StoryModel | null>();

    constructor() {
        effect(() => {
            const content = this.data()?.content;
            if (content)
                this.contentControl.setValue(content);
        })
    }
    
    // Initialize editor instance
    editor: Editor = new Editor();

    // Toolba config - tools to include
    toolbar: Toolbar = [
        ['bold', 'italic', 'underline']
    ]
    
    // Use a Formcontrol to manage the editor's content
    contentControl = new FormControl(
        '<h2>Your Story Title</h2><p>Begin writing your story here...</p>',
        [Validators.required()]
    )

    public getContent(): string | null {
        console.log()
        const storyText = this.contentControl.value;
        return storyText;
    }
    
    ngOnDestroy(): void {
        this.editor.destroy();
    }
    
}