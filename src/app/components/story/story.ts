import { Component, signal, ViewChild } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { TextEditorComponent } from "../../shared/components/text-editor/text-editor";

@Component({
    selector: 'app-story',
    templateUrl: './story.html',
    styleUrls: ['./story.scss'],
    standalone: true,
    imports: [
        IconButton,
        TextEditorComponent
    ]
})
export class Story extends BaseComponent {

    @ViewChild(TextEditorComponent) private storyEditor!: TextEditorComponent;

    isSaving = signal<boolean>(false);
    saveFailed: boolean = false;

    navigateTo(page: Pages) {
        this.goTo(page);
    }

    getStoryContentAndSave() {
        const storyText = this.storyEditor?.getContent();
        if (storyText) {
            this.isSaving.set(true);
            this.storyState.addOrUpdateStory({ content: storyText })
                ?.subscribe({
                    next: () => {
                        this.isSaving.set(false);
                        this.saveFailed = false;
                    },
                    error: () => {
                        this.isSaving.set(false);
                        this.saveFailed = true;
                    }
                })
        }
    }
    
}