import { Routes } from '@angular/router';
import { Pages } from './shared/enums/pages';
import { AuthGuard } from './shared/middlewares/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: Pages.Login,
        pathMatch: 'full'
    },
    {
        path: Pages.Login,
        loadComponent: () => import('./components/login/login').then(m => m.Login)
    },
    {
        path: Pages.Dashboard,
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [AuthGuard]
    },
    {
        path: Pages.Realm,
        loadComponent: () => import('./components/realm/realm').then(m => m.Realm),
        canActivate: [AuthGuard]
    },
    {
        path: Pages.Canvas,
        loadComponent: () => import('./components/canvas/canvas').then(m => m.Canvas),
        canActivate: [AuthGuard]
    },
    {
        path: Pages.Story,
        loadComponent: () => import('./components/story/story').then(m => m.Story),
        canActivate: [AuthGuard]
    },
    {
        path: Pages.Screenplay,
        loadComponent: () => import('./components/screenplay/screenplay').then(m => m.Screenplay),
        canActivate: [AuthGuard]
    },
    {
        path: Pages.Storyboard,
        loadComponent: () => import('./components/storyboard/storyboard').then(m => m.Storyboard),
        canActivate: [AuthGuard]
    },
    {
        path: Pages.Animatics,
        loadComponent: () => import('./components/animatics/animatics').then(m => m.Animatics),
        canActivate: [AuthGuard]
    }
];
