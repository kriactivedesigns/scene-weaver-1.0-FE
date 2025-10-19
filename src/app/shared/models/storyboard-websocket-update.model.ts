import { StoryboardImageModel } from "./storyboard-image.model";

export interface StoryboardWebsocketUpdate {
    event: 'GENERATION_IN_PROGRESS' | 'IMAGE_GENERATED' | 'JOB_CANCELLED' | 'JOB_COMPLETED' | 'ERROR';
    job_id?: string;
    progress?: string;
    storyboard?: StoryboardImageModel;
    scene_id?: string;
    detail?: string;
}