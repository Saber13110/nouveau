import { Routes } from '@angular/router';
import { ADVANCED_SHIPMENT_TRACKING_ROUTES } from './pages/advanced-shipment-tracking/advanced-shipment-tracking.routes';
import { HISTORY_ROUTES } from './components/history/history.routes';
import { HOME_ROUTES } from './pages/home/home.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    children: HOME_ROUTES
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./features/tracking/tracking.module').then(m => m.TrackingModule)
  },
  {
    path: 'advanced-tracking',
    children: ADVANCED_SHIPMENT_TRACKING_ROUTES
  },
  {
    path: 'history',
    children: HISTORY_ROUTES
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.routes').then(m => m.HELP_ROUTES)
  },
  {
    path: 'profile',
    loadChildren: () => import('./pages/profile/profile.routes').then(m => m.PROFILE_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
