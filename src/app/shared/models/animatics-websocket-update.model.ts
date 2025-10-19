import { AnimaticSceneModel } from "./animatics-scene.model";

export interface AnimaticsWebsocketUpdate {
    event: 'JOB_STARTED' | 'IMAGE_GENERATED' | 'ERROR' | 'JOB_CANCELLED' | 'JOB_COMPLETED';
    job_id?: string;
    progress?: string;
    animatics?: AnimaticSceneModel;
    scene_id?: string;
    detail?: string;
}