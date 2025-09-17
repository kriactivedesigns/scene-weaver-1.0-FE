import { Component, computed, inject, input, output } from "@angular/core";
import { StoryboardImageMetadataModel } from "../../../models/storyboard-image-metadata.model";
import { TimeFormatPipe } from "../../../pipe/time-format.pipe";
import { FormsModule } from "@angular/forms";
import { CommonService } from "../../../services/common.service";

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
    storyboardImage = input<StoryboardImageMetadataModel | null>();
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