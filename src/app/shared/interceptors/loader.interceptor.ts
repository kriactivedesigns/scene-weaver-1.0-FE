import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoaderService } from "../services/loader.service";
import { finalize, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class LoaderInterceptor implements HttpInterceptor {

    private loaderService = inject(LoaderService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.loaderService.show();

        return next.handle(req).pipe(
            finalize(() => this.loaderService.hide())
        )
    }
    
}