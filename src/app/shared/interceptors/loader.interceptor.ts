import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoaderService } from "../services/loader.service";
import { finalize, Observable } from "rxjs";
import { SKIP_LOADER_TOKEN } from "../constants/constants";

@Injectable({ providedIn: 'root' })
export class LoaderInterceptor implements HttpInterceptor {

    private loaderService = inject(LoaderService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.context.get(SKIP_LOADER_TOKEN)) {
            return next.handle(req);
        }
        
        this.loaderService.show();
        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        )
    }
    
}