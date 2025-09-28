import { Pages } from "../enums/pages.enum";

export interface StageConfig {
  name: string;
  route: Pages;
  enabled: boolean;
  isInBreadcrumb?: boolean;
}

export const STAGE_CONFIG: StageConfig[] = [
    { name: 'Login', route: Pages.Login, enabled: true, isInBreadcrumb: false },
    { name: 'Dashboard', route: Pages.Dashboard, enabled: true, isInBreadcrumb: false },
    { name: 'Realm', route: Pages.Realm, enabled: true, isInBreadcrumb: true },
    { name: 'Canvas', route: Pages.Canvas, enabled: true, isInBreadcrumb: true },
    { name: 'Story', route: Pages.Story, enabled: true, isInBreadcrumb: true },
    { name: 'Screenplay', route: Pages.Screenplay, enabled: true, isInBreadcrumb: true },
    { name: 'Storyboard', route: Pages.Storyboard, enabled: true, isInBreadcrumb: true },
    { name: 'Animatics', route: Pages.Animatics, enabled: false, isInBreadcrumb: true }
];