import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { LoginState } from "../services/login-state.service";

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

    private readonly loginState = inject(LoginState);
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (req.url.includes('/auth/')) {
            return next.handle(req);
        }
        
        const authReq = req.clone({
            setHeaders: {
                'Authorization': `Bearer ${this.loginState.token()}`
            }
        });
        
        return next.handle(authReq);
    }
    
}