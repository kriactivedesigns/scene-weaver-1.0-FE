import { Component, computed, effect,  OnInit,  signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryboardMiniComponent } from "../../shared/components/story-board/story-board-mini/story-board-mini";
import { StoryboardMainComponent } from "../../shared/components/story-board/story-board-main/story-board-main";
import { StoryboardImageModel } from "../../shared/models/storyboard-image.model";
import { DialogResult, DialogType } from "../../shared/types/dialog.types";
import { ProcessingBarComponent } from "../../shared/components/processing-bar/processing-bar";

@Component({
    selector: 'app-storyboard',
    templateUrl: './storyboard.html',
    styleUrls: ['./storyboard.scss'],
    standalone: true,
    imports: [
    IconButton,
    StoryboardMiniComponent,
    StoryboardMainComponent,
    ProcessingBarComponent
]
})
export class Storyboard extends BaseComponent implements OnInit {

    storyboards = this.storyboardState.storyboards;
    status = this.storyboardState.status;
    progress = this.storyboardState.progress;
    buttonText = computed(() => {
        switch (this.status()) {
            case 'cancelling':
                return 'STORYBOARD GENERATION - CANCELLING...';
            case 'in-progress':
                return 'STORYBOARD GENERATION - STOP?';
            case 'error':
                return 'STORYBOARD GENERATION FAILED - RETRY?';
            default:
                return 'GENERATE STORYBOARDS?';
        }
    })

    selectedImage = signal<StoryboardImageModel>(this.storyboards()[0]);

    ngOnInit(): void {
        if (this.status() === 'idle' && this.storyboards().length === 0) {
            this.screenplayState.getProjectScreenplay()
            .then(() => this.storyboardState.getProjectStoryboard())
        }
    }

    constructor() {
        super();
        effect(() => {
            console.log("Storyboard status changed:", this.status());
            if (this.status() === 'cancelled') {
                this.storyboardState.getProjectStoryboard()
                .then(() => this.selectStoryboardImage(this.storyboards()[0].sceneId))
            }
        })
        effect(() => {
            if (!this.storyboards().length)
                return
            if (!this.selectedImage()) {
                this.selectStoryboardImage(this.storyboards()[0].sceneId);
            }
        })
        effect(() => {
            const lastGeneratedSceneId = this.storyboardState.lastGeneratedImageSceneId();
            if (lastGeneratedSceneId) {
                this.selectStoryboardImage(lastGeneratedSceneId)
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

    cancelStoryboardGeneration() {
        if (this.buttonText() === 'STORYBOARD GENERATION - CANCELLING...') {
            return
        } else if (this.buttonText() == 'STORYBOARD GENERATION - STOP?') {
            this.storyboardState.cancelGeneration();
            return
        } else {
            this.storyboardState.generateStoryboards();
        }
    }

    navigateTo(page?: Pages) {
        if (!page) return
        
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