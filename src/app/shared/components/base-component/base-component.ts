import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginState } from "../../services/login-state.service";
import { GlobalState } from "../../services/global-state.service";
import { ProjectState } from "../../state/project.state";
import { Pages } from "../../enums/pages.enum";
import { RealmState } from "../../state/realm.state";
import { CanvasState } from "../../state/canvas.state";
import { StoryState } from "../../state/story.state";
import { ScreenplayState } from "../../state/screenplay.state";
import { CommonService } from "../../services/common.service";
import { StoryboardState } from "../../state/storyboard.state";
import { AnimaticsState } from "../../state/animatics.state";
import { LoaderService } from "../../services/loader.service";

export abstract class BaseComponent {

    public Pages = Pages;
    protected readonly loginState = inject(LoginState);
    protected readonly loaderService = inject(LoaderService);
    protected readonly globalState = inject(GlobalState);
    protected readonly router = inject(Router);
    protected readonly commonService = inject(CommonService);

    // Stage wise state slices inject
    protected readonly projectState = inject(ProjectState);
    protected readonly realmState = inject(RealmState);
    protected readonly canvasState = inject(CanvasState);
    protected readonly storyState = inject(StoryState);
    protected readonly screenplayState = inject(ScreenplayState);
    protected readonly storyboardState = inject(StoryboardState);
    protected readonly animaticState = inject(AnimaticsState);

    protected goTo(page: string): void {
        this.router.navigateByUrl(page);
    }

}