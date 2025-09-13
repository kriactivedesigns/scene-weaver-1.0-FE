import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginState } from "../../services/login-state.service";
import { GlobalState } from "../../services/global-state.service";
import { ProjectState } from "../../state/project.state";
import { Pages } from "../../enums/pages.enum";
import { RealmState } from "../../state/realm.state";

export abstract class BaseComponent {

    public Pages = Pages;
    protected loginState = inject(LoginState);
    protected globalState = inject(GlobalState);
    protected router = inject(Router);

    // Stage wise state slices inject
    protected projectState = inject(ProjectState);
    protected realmState = inject(RealmState);

    protected goTo(page: string): void {
        this.router.navigateByUrl(page);
    }

}