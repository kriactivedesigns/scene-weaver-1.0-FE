import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { LoginState } from "../../services/login-state.service";
import { GlobalState } from "../../services/global-state.service";
import { GenerationService } from "../../services/generative.service";
import { ProjectState } from "../../state/project.state";
import { Pages } from "../../enums/pages";

export abstract class BaseComponent {
    protected loginState = inject(LoginState);
    protected globalState = inject(GlobalState);
    protected generativeService = inject(GenerationService);
    protected projectState = inject(ProjectState);
    protected router = inject(Router);  
    public Pages = Pages;  

    protected goTo(page: string): void {
        this.router.navigateByUrl(page);
    }

}