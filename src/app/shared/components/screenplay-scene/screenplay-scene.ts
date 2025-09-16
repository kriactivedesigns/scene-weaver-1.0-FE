import { Component, effect, inject, input, signal, ViewChild } from "@angular/core";
import { ScreenplaySceneModel } from "../../models/screenplay-scene.model";
import { TextEditorComponent } from "../text-editor/text-editor";
import { IconButton } from "../icon-button/icon-button";
import { TimeFormatPipe } from "../../pipe/time-format.pipe";
import { ScreenplayState } from "../../state/screenplay.state";

@Component({
    selector: 'screenplay-scene',
    templateUrl: './screenplay-scene.html',
    styleUrl: './screenplay-scene.scss',
    imports: [
        IconButton,
        TextEditorComponent,
        TimeFormatPipe
    ]
})
export class ScreenplaySceneComponent {

    screenplayState = inject(ScreenplayState);
    @ViewChild(TextEditorComponent) private storyEditor!: TextEditorComponent;
    
    scene = input<ScreenplaySceneModel>();
    isSaving = signal<boolean>(false);
    saveFailed: boolean = false;

    getStoryContentAndSave() {
        const screenplayText = this.storyEditor?.getContent();
        let currentScreenplayScene = this.scene();
        if (screenplayText && currentScreenplayScene) {
            this.isSaving.set(true);
            const updatedScreenplay: ScreenplaySceneModel = {
                ...currentScreenplayScene,
                content: screenplayText
            }
            this.screenplayState.updateScreenplay(updatedScreenplay)
                ?.subscribe({
                    next: () => {
                        this.isSaving.set(false);
                        this.saveFailed = false;
                    },
                    error: () => {
                        this.isSaving.set(false);
                        this.saveFailed = true;
                    }
                })
        }
    }

    deleteScene() {
        const currentScene = this.scene();
        if (currentScene)
            this.screenplayState.deleteScene(currentScene);
    }
    
}