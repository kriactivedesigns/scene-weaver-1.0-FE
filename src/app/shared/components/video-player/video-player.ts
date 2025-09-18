import { CommonModule, DecimalPipe } from "@angular/common";
import { Component, computed, effect, ElementRef, inject, input, signal, viewChild } from "@angular/core";
import { IconButton } from "../icon-button/icon-button";
import { CommonService } from "../../services/common.service";

@Component({
    selector: 'video-player',
    templateUrl: 'video-player.html',
    styleUrl: 'video-player.scss',
    imports: [
    CommonModule,
    DecimalPipe,
    IconButton
]
})
export class VideoPlayerComponent {

    private commonService = inject(CommonService);
    src = input.required<string>();

    private videoPlayerRef = viewChild.required<ElementRef<HTMLVideoElement>>('videoPlayer');

    isPlaying = signal<boolean>(false);
    currentTime = signal<number>(0);
    duration = signal<number>(0);

    height: number = 0;
    width = computed(() => {
        this.height = 450;
        return this.commonService.updateWidth(this.height, "16:9");
    });

    constructor() {
        effect(() => {
            const newSrc = this.src();
            const videoElement = this.videoPlayerRef()?.nativeElement;
            if (videoElement && videoElement.src !== newSrc) {
                videoElement.load();
                this.isPlaying.set(false);
            }
        })
    }

    onMetadataLoaded(): void {
        this.currentTime.set(this.videoPlayerRef().nativeElement.currentTime);
    }

    onTimeUpdate(): void {
        this.currentTime.set(this.videoPlayerRef().nativeElement.currentTime);
    }

    togglePlayPause(): void {
        if (this.isPlaying()) {
            this.videoPlayerRef().nativeElement.pause();
        } else {
            this.videoPlayerRef().nativeElement.play();
        }
    }

    onSliderChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const newTime = parseFloat(target.value);
        this.videoPlayerRef().nativeElement.currentTime = newTime;
        this.currentTime.set(newTime);
    }
    
}