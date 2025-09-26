import { Component, inject, input, signal, ViewChild } from "@angular/core";
import { ScreenplaySceneModel } from "../../models/screenplay-scene.model";
import { TextEditorComponent } from "../text-editor/text-editor";
import { IconButton } from "../icon-button/icon-button";
import { ScreenplayState } from "../../state/screenplay.state";
import { TimeInputComponent } from "../time-input/time-input";

@Component({
    selector: 'screenplay-scene',
    templateUrl: './screenplay-scene.html',
    styleUrl: './screenplay-scene.scss',
    imports: [
    IconButton,
    TextEditorComponent,
    TimeInputComponent
]
})
export class ScreenplaySceneComponent {

    screenplayState = inject(ScreenplayState);
    @ViewChild(TextEditorComponent) private storyEditor!: TextEditorComponent;
    
    scene = input<ScreenplaySceneModel>();
    isSaving = signal<boolean>(false);
    saveFailed: boolean = false;

    onDurationChange(timeInSeconds: number) {
        
        const currentScene = this.scene();
        if (!currentScene)
            return

        if (timeInSeconds === currentScene.duration)
            return

        this.isSaving.set(true);
        this.screenplayState.updateScreenplayScene({
            ...currentScene,
            duration: timeInSeconds
        })

    }

    getStoryContentAndSave() {
        const screenplayText = this.storyEditor?.getContent();
        let currentScreenplayScene = this.scene();
        if (screenplayText && currentScreenplayScene) {
            this.isSaving.set(true);
            const updatedScreenplay: ScreenplaySceneModel = {
                ...currentScreenplayScene,
                content: screenplayText
            }
            this.screenplayState.updateScreenplayScene(updatedScreenplay)
                .finally(() => this.isSaving.set(false))
        }
    }

    deleteScene() {
        const currentScene = this.scene();
        if (currentScene)
            this.screenplayState.deleteScene(currentScene);
    }
    
}