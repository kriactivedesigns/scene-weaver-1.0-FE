import { Component, computed, effect, inject, input, output } from "@angular/core";
import { StoryboardImageModel } from '../../../models/storyboard-image.model';
import { ScreenplayState } from "../../../state/screenplay.state";
import { StoryboardImageMetadataModel } from "../../../models/storyboard-image-metadata.model";
import { CommonService } from "../../../services/common.service";

@Component({
    selector: 'story-board-mini',
    templateUrl: './story-board-mini.html',
    styleUrl: './story-board-mini.scss',
})
export class StoryboardMiniComponent {

    private readonly commonService = inject(CommonService);
    private readonly screenplayState = inject(ScreenplayState);
    storyboardImage = input.required<StoryboardImageModel>();
    isSelected = input<boolean>(false);
    onselect = output<StoryboardImageModel>();

    height: number = 0;
    width = computed(() => {
        this.height = 120;
        return this.commonService.updateWidth(this.height, "16:9");
    });

    image?: StoryboardImageMetadataModel; 

    constructor() {
        effect(() => {

            const sceneId = this.storyboardImage()?.sceneId;
            if (!sceneId || !this.storyboardImage())
                return;
            
            const scene = this.screenplayState.getSceneByID(sceneId);
            if (!scene)
                return;

            this.image = {
                ...this.storyboardImage(),
                scene: scene
            }
            
        })
    }

    selectImage() {
        this.onselect.emit(this.storyboardImage());
    }
    
}