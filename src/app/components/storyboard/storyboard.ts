import { Component, computed, effect,  OnInit,  signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryboardMiniComponent } from "../../shared/components/story-board/story-board-mini/story-board-mini";
import { StoryboardMainComponent } from "../../shared/components/story-board/story-board-main/story-board-main";
import { StoryboardImageModel } from "../../shared/models/storyboard-image.model";
import { ScreenplaySceneModel } from "../../shared/models/screenplay-scene.model";
import { DialogResult, DialogType } from "../../shared/types/dialog.types";

@Component({
    selector: 'app-storyboard',
    templateUrl: './storyboard.html',
    styleUrls: ['./storyboard.scss'],
    standalone: true,
    imports: [
    IconButton,
    StoryboardMiniComponent,
   StoryboardMainComponent
]
})
export class Storyboard extends BaseComponent implements OnInit {

    storyboards = this.storyboardState.storyboards;
    status = this.storyboardState.status;
    progress = this.storyboardState.progress;

    selectedImage = signal<StoryboardImageModel>(this.storyboards()[0]);

    ngOnInit(): void {
        // Get screenplay list and storyboard list for the project
        this.screenplayState.getProjectScreenplay()
        .then(() => this.storyboardState.getProjectStoryboard())
    }

    constructor() {
        super();
        effect(() => {
            if (!this.storyboards().length)
                return
            if (!this.selectedImage()) {
                this.selectStoryboardImage(this.storyboards()[0].sceneId);
            }
        })
    }

    selectStoryboardImage(sceneId: string) {
        const scene = this.screenplayState.getSceneByID(sceneId);
        const storyboardImage = this.storyboardState.getStoryboardImageBySceneID(sceneId);
        if(scene && storyboardImage) {
            this.selectedImage.set({ ...storyboardImage })
        }
    }

    submitPrompt(prompt: string) {
        // const selectedImageId = this.selectedImage()?.id;
        // if (!selectedImageId)
        //     return;
        // this.storyboardState.updateImageWithPrompt(prompt,selectedImageId)
    }

    navigateTo(page: Pages) {
        
        if (page !== Pages.Animatics) {
            this.goTo(page);
            return
        }
        this.animaticState.getProjectAnimatics()
        .then(animatics => {
            if (animatics) {
                const dialogRef$ = this.dialogService.open({
                    title: 'Confirm',
                    message: `
                        You already have a animatics saved. Generating a new animatics will permanently overwrite the existing one.
                        <div class="options">
                            <p>
                                Click <strong>Generate</strong> to generate and replace the current animatics with new.
                            </p>
                            <p>
                                Click <strong>Skip</strong> to keep the existing animatics and navigate to the animatics page.
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
                        this.animaticState.generateProjectAnimatics()
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