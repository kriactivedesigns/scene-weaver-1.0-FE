import { Component, effect, OnInit, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryThread } from "../../shared/components/story-thread/story-thread";
import { StoryThreadModel } from "../../shared/models/story-thread.model";
import { DialogResult, DialogType } from "../../shared/types/dialog.types";

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.html',
    styleUrls: ['./canvas.scss'],
    standalone: true,
    imports: [
        IconButton,
        StoryThread
    ]
})
export class Canvas extends BaseComponent implements OnInit {
    
    ngOnInit(): void {
        this.canvasState.getProjectStoryThreads();
    }
    
    addNewSnippet() {
        const order = this.canvasState.threads().length + 1
        const newThread: Omit<StoryThreadModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
            content: '',
            order: order
        }
        this.canvasState.addThread(newThread);
    }

    deleteSnippet(thread: StoryThreadModel) {
        this.canvasState.deleteThread(thread.id);
    }
    
    navigateTo(page: Pages) {

        if (page !== Pages.Story) {
            this.goTo(page);
            return
        }

        this.storyState.getProjectStory()
        .then(story => {
            if (story) {
                const dialogRef$ = this.dialogService.open({
                    title: 'Confirm',
                    message: `
                        You already have a story saved. Generating a new story will permanently overwrite the existing one.
                        <div class="options">
                            <p>
                                Click <strong>Generate</strong> to replace the current story.
                            </p>
                            <p>
                                Click <strong>Skip</strong> to keep the existing story and navigate to the Story page.
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
                        this.storyState.generateStory()
                            .then(() => {
                                this.goTo(page);
                            })
                    } else if (result === DialogResult.Continue) {
                        this.goTo(page);
                    } else {
                        return;
                    }
                })
            } else {
                this.goTo(page);
            }
        })

    }
}