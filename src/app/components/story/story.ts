import { Component, OnInit, signal, ViewChild } from "@angular/core";
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
export class Story extends BaseComponent implements OnInit {

    @ViewChild(TextEditorComponent) private storyEditor!: TextEditorComponent;

    isSaving = signal<boolean>(false);
    saveFailed: boolean = false;

    ngOnInit(): void {
        this.storyState.getProjectStory()
    }

    getStoryContentAndSave() {
        const storyText = this.storyEditor?.getContent();
        const currentStory = this.storyState.story();
        if (storyText && currentStory) {
            this.isSaving.set(true);
            this.storyState.updateStory({ 
                ...currentStory,
                content: storyText
            })
        }
    }

    navigateTo(page: Pages) {
        if (page === Pages.Screenplay) {
            this.screenplayState.generateScreenplayScenes()
                .then(() => {
                    this.goTo(page);
                })
        } else {
            this.goTo(page);
        }
    }
    
}