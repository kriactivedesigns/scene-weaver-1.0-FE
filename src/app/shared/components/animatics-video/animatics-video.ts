import { Component, computed, inject, input, output } from "@angular/core";
import { TimeFormatPipe } from "../../pipe/time-format.pipe";
import { FormsModule } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { VideoPlayerComponent } from "../video-player/video-player";
import { AnimaticSceneModel } from "../../models/animatics-scene.model";
import { ScreenplayState } from "../../state/screenplay.state";
import { ScreenplaySceneModel } from "../../models/screenplay-scene.model";

@Component({
    selector: 'animatics-video',
    templateUrl: './animatics-video.html',
    styleUrl: './animatics-video.scss',
    imports: [
    TimeFormatPipe,
    FormsModule,
    VideoPlayerComponent
]
})
export class AnimaticsVideoComponent {
    
    private readonly commonService = inject(CommonService);
    private readonly screenplayState = inject(ScreenplayState);
    
    animaticScene = input.required<AnimaticSceneModel>();
    scene= computed<ScreenplaySceneModel | null>(() => {
        const sceneId = this.animaticScene()?.sceneId;
        const scene = this.screenplayState.getSceneByID(sceneId);
        if(!scene) {
            return null
        } else {
            return scene
        }
        
    });
    imageUrl = computed<string>(() => {
        if (this.animaticScene()?.videoPath === 'generating')
            return this.animaticScene()?.videoPath
        const path = `http://127.0.0.1:8000/${this.animaticScene()?.videoPath}?timestamp=${new Date().getTime()}`
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