import { Routes } from '@angular/router';
import { Pages } from './constants/pages';

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
        loadComponent: () => import('./components/dashboard/dashboard').then(m => m.Dashboard)
    },
    {
        path: Pages.Realm,
        loadComponent: () => import('./components/realm/realm').then(m => m.Realm)
    },
    {
        path: Pages.Canvas,
        loadComponent: () => import('./components/canvas/canvas').then(m => m.Canvas)
    },
    {
        path: Pages.Story,
        loadComponent: () => import('./components/story/story').then(m => m.Story)
    },
    {
        path: Pages.Screenplay,
        loadComponent: () => import('./components/screenplay/screenplay').then(m => m.Screenplay)
    },
    {
        path: Pages.Storyboard,
        loadComponent: () => import('./components/storyboard/storyboard').then(m => m.Storyboard)
    },
    {
        path: Pages.Animatics,
        loadComponent: () => import('./components/animatics/animatics').then(m => m.Animatics)
    }
];
