import { Routes } from '@angular/router';
import { Pages } from './shared/enums/pages.enum';
import { AuthGuard } from './shared/middlewares/auth.guard';
import { RouteGuard } from './shared/middlewares/route.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: Pages.Dashboard,
        pathMatch: 'full'
    },
    {
        path: Pages.Login,
        loadComponent: () => import('./components/login/login').then(m => m.Login),
        canActivate: [RouteGuard]
    },
    {
        path: Pages.Dashboard,
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard),
        canActivate: [AuthGuard, RouteGuard]
    },
    {
        path: Pages.Realm,
        loadComponent: () => import('./components/realm/realm').then(m => m.Realm),
        canActivate: [AuthGuard, RouteGuard]
    },
    {
        path: Pages.Canvas,
        loadComponent: () => import('./components/canvas/canvas').then(m => m.Canvas),
        canActivate: [AuthGuard, RouteGuard]
    },
    {
        path: Pages.Story,
        loadComponent: () => import('./components/story/story').then(m => m.Story),
        canActivate: [AuthGuard, RouteGuard]
    },
    {
        path: Pages.Screenplay,
        loadComponent: () => import('./components/screenplay/screenplay').then(m => m.Screenplay),
        canActivate: [AuthGuard, RouteGuard]
    },
    {
        path: Pages.Storyboard,
        loadComponent: () => import('./components/storyboard/storyboard').then(m => m.Storyboard),
        canActivate: [AuthGuard, RouteGuard]
    },
    {
        path: Pages.Animatics,
        loadComponent: () => import('./components/animatics/animatics').then(m => m.Animatics),
        canActivate: [AuthGuard, RouteGuard]
    }
];