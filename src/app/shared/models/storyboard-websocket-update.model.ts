import { StoryboardImageModel } from "./storyboard-image.model";

export interface StoryboardWebsocketUpdate {
    event: 'JOB_STARTED' | 'IMAGE_GENERATED' | 'ERROR' | 'JOB_CANCELLED' | 'JOB_COMPLETED';
    job_id?: string;
    progress?: string;
    storyboard?: StoryboardImageModel;
    scene_id?: string;
    detail?: string;
}