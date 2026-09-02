import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/public/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
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
    loadChildren: () => import('./features/washer/washer.routes').then(m => m.WASHER_ROUTES),
    canActivate: [authGuard, roleGuard(['washer'])]
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard, roleGuard(['admin'])]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

