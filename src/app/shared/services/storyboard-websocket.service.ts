import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { StoryboardWebsocketUpdate as StoryboardWebSocketUpdate } from "../models/storyboard-websocket-update.model";
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class StoryboardWebSocketService {

    private socket$!: WebSocketSubject<StoryboardWebSocketUpdate>;

    public connect(jobId: string): WebSocketSubject<StoryboardWebSocketUpdate> {
        const wsUrl = `${environment.apiBaseUrl}/ws/storyboard-updates/${jobId}`

        this.socket$ = webSocket(wsUrl);
        return this.socket$;
    }
    
    public disconnect(): void {
        if (this.socket$) {
            this.socket$.complete();
        }
    }
    
}