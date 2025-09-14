import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginState } from "../../services/login-state.service";
import { GlobalState } from "../../services/global-state.service";
import { ProjectState } from "../../state/project.state";
import { Pages } from "../../enums/pages.enum";
import { RealmState } from "../../state/realm.state";
import { CanvasState } from "../../state/canvas.state";

export abstract class BaseComponent {

    public Pages = Pages;
    protected readonly loginState = inject(LoginState);
    protected readonly globalState = inject(GlobalState);
    protected readonly router = inject(Router);

    // Stage wise state slices inject
    protected readonly projectState = inject(ProjectState);
    protected readonly realmState = inject(RealmState);
    protected readonly canvasState = inject(CanvasState);

    protected goTo(page: string): void {
        this.router.navigateByUrl(page);
    }

}