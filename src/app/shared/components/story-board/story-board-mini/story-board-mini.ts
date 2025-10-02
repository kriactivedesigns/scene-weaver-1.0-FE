import { Component, computed, effect, inject, input, output } from "@angular/core";
import { StoryboardImageModel } from '../../../models/storyboard-image.model';
import { ScreenplayState } from "../../../state/screenplay.state";
import { CommonService } from "../../../services/common.service";
import { ScreenplaySceneModel } from "../../../models/screenplay-scene.model";

@Component({
    selector: 'story-board-mini',
    templateUrl: './story-board-mini.html',
    styleUrl: './story-board-mini.scss',
})
export class StoryboardMiniComponent {

    private readonly commonService = inject(CommonService);
    private readonly screenplayState = inject(ScreenplayState);
    
    storyboardImage = input.required<StoryboardImageModel>();
    imageUrl = computed<string>(() => {
       if (this.storyboardImage()?.imagePath === 'generating')
            return this.storyboardImage()?.imagePath
        const path = `${this.storyboardImage()?.imagePath}?timestamp=${new Date().getTime()}`
        return path
    })
    scene= computed<ScreenplaySceneModel | null>(() => {
        const sceneId = this.storyboardImage()?.sceneId;
        const scene = this.screenplayState.getSceneByID(sceneId);
        if(!scene) {
            return null
        } else {
            return scene
        }
    });
    isSelected = input<boolean>(false);
    onselect = output<string>();

    height: number = 0;
    width = computed(() => {
        this.height = 100;
        return this.commonService.updateWidth(this.height, "16:9");
    });

    selectImage() {
        this.onselect.emit(this.storyboardImage().sceneId);
    }
    
}