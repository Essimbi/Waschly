import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
    title: 'Waschly – Ihr Auto. Blitzsauber. In Minuten.'
  },
  {
    path: 'dev/design-system',
    loadComponent: () => import('./dev/design-system/design-system.component').then(m => m.DesignSystemComponent)
  },
  {
    path: 'client',
    loadChildren: () => import('./features/client/client.routes').then(m => m.CLIENT_ROUTES),
    canActivate: [authGuard, roleGuard(['client'])]
  },
  {
    path: 'washer',
    loadComponent: () => import('./features/washer/washer.component').then(m => m.default),
    canActivate: [authGuard, roleGuard(['washer'])]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.default),
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

