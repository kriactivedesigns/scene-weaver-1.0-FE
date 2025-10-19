import { ApplicationRef, createComponent, EnvironmentInjector, inject, Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { DialogData, DialogResult } from "../types/dialog.types";
import { DialogComponent } from "../components/dialog/dialog";

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    private injector = inject(EnvironmentInjector);
    private appRef = inject(ApplicationRef)

    open(data: DialogData) {

        const result$ = new Subject<DialogResult>();
        const componentRef = createComponent(DialogComponent, {
            environmentInjector: this.injector,
        })

        componentRef.setInput('data', data);
        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as any).rootNodes[0] as HTMLElement;
        document.body.appendChild(domElem);

        const subscription = componentRef.instance.onclose.subscribe((result: DialogResult) => {
            result$.next(result);
            result$.complete();
            this.appRef.detachView(componentRef.hostView);
            if (domElem.parentNode) {
                domElem.parentNode.removeChild(domElem);
            }
            componentRef.destroy();
            subscription.unsubscribe();
        })

        return result$.asObservable();
    }
    
}