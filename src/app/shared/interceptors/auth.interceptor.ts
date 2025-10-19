import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
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
        
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    return this.handleTokoenRefresh(authReq, next);
                }

                return throwError(() => error);
                
            })
        );
    }

    private handleTokoenRefresh(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return new Observable(observer => {
            this.loginState.reAuth()
            .then(() => {
                const retryReq = req.clone({
                    setHeaders: {
                        'Authorization': `Bearer ${this.loginState.token()}`
                    }
                });
                next.handle(retryReq).pipe(
                    catchError((retryError: HttpErrorResponse) => {
                        if (retryError.status === 401) {
                                console.error('Request failed after token refresh, logging out user');
                                this.loginState.logout(true);
                                observer.complete();
                                return throwError(() => retryError);
                        }
                        // For other errors, just pass them through
                        return throwError(() => retryError);
                    })
                ).subscribe({
                    next: (event) => observer.next(event),
                    error: (err) => observer.error(err),
                    complete: () => observer.complete()
                });
            }).catch((refreshError) => {
                console.error('Token refresh failed:', refreshError);
                this.loginState.logout(true);
                observer.complete();
            })
        })
        
    }
    
    
}