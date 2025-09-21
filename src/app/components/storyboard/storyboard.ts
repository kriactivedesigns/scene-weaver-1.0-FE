import { Component, computed, effect, inject, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryboardMiniComponent } from "../../shared/components/story-board/story-board-mini/story-board-mini";
import { StoryboardMainComponent } from "../../shared/components/story-board/story-board-main/story-board-main";
import { StoryboardImageModel } from "../../shared/models/storyboard-image.model";
import { ScreenplayState } from "../../shared/state/screenplay.state";
import { ScreenplaySceneModel } from "../../shared/models/screenplay-scene.model";

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
export class Storyboard extends BaseComponent {

    storyboard = this.storyboardState.storyboard;
    selectedImage = signal<StoryboardImageModel>(this.storyboard()[0]);
    scene= computed<ScreenplaySceneModel | undefined>(() => {
        const sceneId = this.selectedImage()?.sceneId;
        if(!sceneId) {
            return
        } else {
            const scene = this.screenplayState.getSceneByID(sceneId);
            return scene
        }
    });

    constructor() {
        super();
        effect(() => {
            if (this.storyboard().length)
                this.selectStoryboardImage(this.storyboard()[0].sceneId);
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
        const selectedImageId = this.selectedImage()?.id;
        if (!selectedImageId)
            return;
        this.storyboardState.updateImageWithPrompt(prompt,selectedImageId)
    }

    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}