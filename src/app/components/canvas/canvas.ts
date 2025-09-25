import { Component, effect, OnInit, signal } from "@angular/core";
import { BaseComponent } from "../../shared/components/base-component/base-component";
import { Pages } from "../../shared/enums/pages.enum";
import { IconButton } from "../../shared/components/icon-button/icon-button";
import { StoryThread } from "../../shared/components/story-thread/story-thread";
import { StoryThreadModel } from "../../shared/models/story-thread.model";

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.html',
    styleUrls: ['./canvas.scss'],
    standalone: true,
    imports: [
        IconButton,
        StoryThread
    ]
})
export class Canvas extends BaseComponent implements OnInit {

    ngOnInit(): void {
        // Get story threads on page load
        const pid = this.projectState.openedProjectId();
        if (pid)
            this.canvasState.getStoryThreadsByProjectId(pid);
    }
    
    addNewSnippet() {
        const order = this.canvasState.threads().length + 1
        const newThread: Omit<StoryThreadModel, 'id' | 'projectId' | 'createdAt' | 'updatedAt'> = {
            content: '',
            order: order
        }
        this.canvasState.addThread(newThread);
    }

    deleteSnippet(thread: StoryThreadModel) {
        this.canvasState.deleteThread(thread.id);
    }
    
    navigateTo(page: Pages) {
        this.goTo(page);
    }
}