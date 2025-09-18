import { Component, computed, effect, inject, input, output } from "@angular/core";
import { TimeFormatPipe } from "../../pipe/time-format.pipe";
import { FormsModule } from "@angular/forms";
import { CommonService } from "../../services/common.service";
import { AnimaticSceneMetadataModel } from "../../models/animatics-scene-metadata.model";
import { VideoPlayerComponent } from "../video-player/video-player";

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
    animaticScene = input<AnimaticSceneMetadataModel | null>();
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