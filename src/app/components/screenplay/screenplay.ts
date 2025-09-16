import { AfterViewInit, Component, effect, ElementRef, QueryList, signal, ViewChildren } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { ScreenplaySceneComponent } from "../../shared/components/screenplay-scene/screenplay-scene";
import { CommonModule } from "@angular/common";
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ScreenplaySceneModel } from "../../shared/models/screenplay-scene.model";
import { Subject, takeUntil } from "rxjs";

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
export class Screenplay extends BaseComponent implements AfterViewInit {

    scenes = this.screenplayState.screenplay;
    @ViewChildren('sceneItem', { read: ElementRef }) sceneItems!: QueryList<ElementRef>;

    private destroy$ = new Subject<void>();
    private previousSceneCount = 0;

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
        const currentScenes = [...this.scenes()];
        moveItemInArray(currentScenes, event.previousIndex, event.currentIndex);
        const updatedScenes = currentScenes.map((scene, index) => ({
            ...scene,
            sceneNumber: index + 1,
        }));
        this.screenplayState.updateSceneOrder(updatedScenes);
    }

    addNewScene() {
        this.screenplayState.addNewScene();
    }
    
    navigateTo(page: Pages) {
        this.goTo(page);
    }
    
}