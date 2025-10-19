import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { environment } from "../../../environments/environment";
import { AnimaticsWebsocketUpdate } from "../models/animatics-websocket-update.model";

@Injectable({
    providedIn: 'root'
})
export class AnimaticsWebSocketService {

    private socket$!: WebSocketSubject<AnimaticsWebsocketUpdate>;

    public connect(jobId: string): WebSocketSubject<AnimaticsWebsocketUpdate> {
        const wsUrl = `${environment.apiBaseUrl}/ws/animatics-updates/${jobId}`

        this.socket$ = webSocket(wsUrl);
        return this.socket$;
    }
    
    public disconnect(): void {
        if (this.socket$) {
            this.socket$.complete();
        }
    }
    
}