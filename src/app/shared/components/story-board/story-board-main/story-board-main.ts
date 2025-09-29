import { Component, computed, inject, input, output } from "@angular/core";
import { TimeFormatPipe } from "../../../pipe/time-format.pipe";
import { FormsModule } from "@angular/forms";
import { CommonService } from "../../../services/common.service";
import { StoryboardImageModel } from "../../../models/storyboard-image.model";
import { ScreenplaySceneModel } from "../../../models/screenplay-scene.model";
import { ScreenplayState } from "../../../state/screenplay.state";

@Component({
    selector: 'story-board-main',
    templateUrl: './story-board-main.html',
    styleUrl: './story-board-main.scss',
    imports: [
        TimeFormatPipe,
        FormsModule
    ]
})
export class StoryboardMainComponent {
    
    private readonly commonService = inject(CommonService);
    private readonly screenplayState = inject(ScreenplayState);
    
    storyboardImage = input.required<StoryboardImageModel>();
    scene= computed<ScreenplaySceneModel | null>(() => {
        const sceneId = this.storyboardImage()?.sceneId;
        const scene = this.screenplayState.getSceneByID(sceneId);
        if(!scene) {
            return null
        } else {
            return scene
        }
    
    });
    imageUrl = computed<string>(() => {
        if (this.storyboardImage()?.imagePath === 'generating')
            return this.storyboardImage()?.imagePath
        const path = `${this.storyboardImage()?.imagePath}?timestamp=${new Date().getTime()}`
        return path
    })
    onpromptsubmit = output<string>();
    prompt: string ='';

    height: number = 0;
    width = computed(() => {
        this.height = 450;
        return this.commonService.updateWidth(this.height, "16:9");
    });

    onPromptSubmit(e: Event) {
        e.preventDefault()
        this.onpromptsubmit.emit(this.prompt);
        this.prompt = '';
    }
    
}