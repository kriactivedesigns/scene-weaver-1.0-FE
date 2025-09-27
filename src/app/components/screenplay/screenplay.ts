import { AfterViewInit, Component, effect, ElementRef, OnInit, QueryList, signal, ViewChildren } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { ScreenplaySceneComponent } from "../../shared/components/screenplay-scene/screenplay-scene";
import { CommonModule } from "@angular/common";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScreenplaySceneModel } from "../../shared/models/screenplay-scene.model";
import { Subject, takeUntil } from "rxjs";
import { DialogResult, DialogType } from "../../shared/types/dialog.types";

@Component({
    selector: 'app-screenplay',
    templateUrl: './screenplay.html',
    styleUrls: ['./screenplay.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IconButton,
        ScreenplaySceneComponent,
        CdkDropList,
        CdkDrag,
        CdkDragHandle
    ]
})
export class Screenplay extends BaseComponent implements AfterViewInit, OnInit {

    scenes = this.screenplayState.screenplayScenes;
    @ViewChildren('sceneItem', { read: ElementRef }) sceneItems!: QueryList<ElementRef>;

    private destroy$ = new Subject<void>();
    private previousSceneCount = 0;

    ngOnInit(): void {
        this.screenplayState.getProjectScreenplay()
    }

    ngAfterViewInit(): void {
        this.sceneItems.changes
            .pipe(takeUntil(this.destroy$))
            .subscribe((list: QueryList<ElementRef>) => {
                if (list.length > this.previousSceneCount) {
                    this.commonService.scrollToLastItem(this.sceneItems)
                }
                this.previousSceneCount = list.length;
            })
        this.previousSceneCount = this.sceneItems.length;
    }

    drop(event: CdkDragDrop<ScreenplaySceneModel[]>) {
        const originalScenes = [...this.scenes()];
        const reorderedScenes = [...originalScenes];

        moveItemInArray(reorderedScenes, event.previousIndex, event.currentIndex);

        const updatedScenes = reorderedScenes.map((scene, index) => ({
            ...scene,
            sceneNumber: index + 1,
        }));

        this.screenplayState.updateSceneOrder(updatedScenes, originalScenes);
    }

    addNewScene() {
        this.screenplayState.addNewScene();
    }
    
    navigateTo(page: Pages) {
    
        if (page !== Pages.Storyboard)
            this.goTo(page);

        this.storyboardState.getProjectStoryboard()
        .then(storyboard => {
            if (storyboard) {
                const dialogRef$ = this.dialogService.open({
                    title: 'Confirm',
                    message: `
                        You already have a storyborad saved. Generating a new storyborad will permanently overwrite the existing one.
                        <div class="options">
                            <p>
                                Click <strong>Generate</strong> to generate and replace the current storyborad with new.
                            </p>
                            <p>
                                Click <strong>Skip</strong> to keep the existing storyborad and navigate to the Storyborad page.
                            </p>
                            <p>
                                Click <strong>Close</strong> to close this dialog.
                            </p>
                        </div>
                    `,
                    type: DialogType.Confirmation,
                    buttons: [
                        {
                            type: 'cancel',
                            text: 'Close'
                        },
                        {
                            type: 'confirm',
                            text: 'Generate'
                        },
                        {
                            type: 'continue',
                            text: 'Skip'
                        }
                    ]
                })
                
                dialogRef$.subscribe(result => {
                    
                    if (result === DialogResult.Confirm) {
                        this.storyboardState.generateStoryboard()
                            .then(() => {
                                this.goTo(page);
                            })
                    } else if (result === DialogResult.Continue) {
                        this.goTo(page);
                    } else {
                        return;
                    }
                })
            } else {
                this.goTo(page);
            }
        })
    }
    
}