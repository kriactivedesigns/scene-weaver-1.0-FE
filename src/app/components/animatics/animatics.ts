import { Component, effect, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryboardMiniComponent } from "../../shared/components/story-board/story-board-mini/story-board-mini";
import { StoryboardMainComponent } from "../../shared/components/story-board/story-board-main/story-board-main";
import { AnimaticSceneMetadataModel } from "../../shared/models/animatics-scene-metadata.model";
import { AnimaticsVideoComponent } from "../../shared/components/animatics-video/animatics-video";
import { AnimaticSceneModel } from "../../shared/models/animatics-scene.model";
import { StoryboardImageModel } from "../../shared/models/storyboard-image.model";

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
export class Animatics extends BaseComponent {

    animatics = this.animaticState.animatics;
    storyboard = this.storyboardState.storyboard;
    selectedAnimatics = signal<AnimaticSceneMetadataModel | null>(null)

    constructor() {
        super();
        effect(() => {
            if (this.animatics().length)
                this.selectAnimaticScene(this.animatics()[0].sceneId);
        })
    }

    selectAnimaticScene(sceneId: string) {
        const selectedAnimatics = this.animaticState.getAnimaticsBySceneID(sceneId)
        const scene = this.screenplayState.getSceneByID(sceneId);
        if(scene && selectedAnimatics) {
            this.selectedAnimatics.set({
                ...selectedAnimatics,
                scene: scene
            })
        }
    }

    submitPrompt(prompt: string) {
        const selectedImageId = this.selectedAnimatics()?.id;
        if (!selectedImageId)
            return;
        this.storyboardState.updateImageWithPrompt(prompt,selectedImageId)
    }

    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}