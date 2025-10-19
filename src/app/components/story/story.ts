import { Component, OnInit, signal, ViewChild } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { TextEditorComponent } from "../../shared/components/text-editor/text-editor";
import { DialogResult, DialogType } from "../../shared/types/dialog.types";

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

    navigateTo(page?: Pages) {
        if (!page) return;
        
        if (page !== Pages.Screenplay) {
            this.goTo(page);
            return
        }

        this.screenplayState.getProjectScreenplay()
        .then(screenplayScenes => {
            if (screenplayScenes.length) {
                const dialogRef$ = this.dialogService.open({
                    title: 'Confirm',
                    message: `
                        You already have a screenplay saved. Generating a new screenplay will permanently overwrite the existing one.
                        <div class="options">
                            <p>
                                Click <strong>Generate</strong> to generate and replace the current screenplay with new.
                            </p>
                            <p>
                                Click <strong>Skip</strong> to keep the existing screenplay and navigate to the Screenplay page.
                            </p>
                            <p>
                                Click <strong>Close</strong> to close this dialog.
                            </p>
                        </div>
                    `,
                    type: DialogType.Confirmation,
                    buttons: [
                        {
                            type: 'cancel',
                            text: 'Close'
                        },
                        {
                            type: 'confirm',
                            text: 'Generate'
                        },
                        {
                            type: 'continue',
                            text: 'Skip'
                        }
                    ]
                })
                
                dialogRef$.subscribe(result => {
                    
                    if (result === DialogResult.Confirm) {
                        this.generateScreenplayAndNavigate();
                    } else if (result === DialogResult.Continue) {
                        this.goTo(page);
                    } else {
                        return;
                    }
                })
            } else {
                this.generateScreenplayAndNavigate();
            }
        })
    }

    private generateScreenplayAndNavigate() {
        this.screenplayState.generateScreenplayScenes()
            .then(() => {
                this.goTo(Pages.Screenplay);
            })
    }
    
}