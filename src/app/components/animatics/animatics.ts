import { Component, effect, OnInit, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryboardMiniComponent } from "../../shared/components/story-board/story-board-mini/story-board-mini";
import { AnimaticsVideoComponent } from "../../shared/components/animatics-video/animatics-video";
import { AnimaticSceneModel } from "../../shared/models/animatics-scene.model";

@Component({
    selector: 'app-storyboard',
    templateUrl: './animatics.html',
    styleUrls: ['./animatics.scss'],
    standalone: true,
    imports: [
    IconButton,
    StoryboardMiniComponent,
    AnimaticsVideoComponent
]
})
export class Animatics extends BaseComponent implements OnInit {

    animatics = this.animaticState.animatics;
    status = this.animaticState.status;
    progress = this.animaticState.progress;

    storyboard = this.storyboardState.storyboards;
    selectedAnimatics = signal<AnimaticSceneModel>(this.animatics()[0])

    constructor() {
        super();

        effect(() => {
            console.log("Animatics status changed:", this.status());
        })
        
        effect(() => {
            if (!this.selectedAnimatics() && this.animatics().length) {
                this.selectAnimaticScene(this.animatics()[0].sceneId);
            }
        })
    }

    ngOnInit(): void {
        // Get storyboard list and animatics list for the project
        this.screenplayState.getProjectScreenplay()
        .then(() => this.storyboardState.getProjectStoryboard())
        .then(() => this.animaticState.getProjectAnimatics());
    }

    selectAnimaticScene(sceneId: string) {
        const selectedAnimatics = this.animaticState.getAnimaticsBySceneID(sceneId)
        const scene = this.screenplayState.getSceneByID(sceneId);
        if(scene && selectedAnimatics) {
            this.selectedAnimatics.set({ ...selectedAnimatics })
        }
    }

    submitPrompt(prompt: string) {
        // const selectedImageId = this.selectedAnimatics()?.id;
        // if (!selectedImageId)
        //     return;
        // this.storyboardState.updateImageWithPrompt(prompt,selectedImageId)
    }

    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}