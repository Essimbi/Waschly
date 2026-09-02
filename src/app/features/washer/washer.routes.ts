import { Routes } from '@angular/router';
import { WasherComponent } from './washer.component';

export const WASHER_ROUTES: Routes = [
  {
    path: '',
    component: WasherComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./listings/washer-listings.component').then(m => m.WasherListingsComponent),
        title: 'Annonces – Waschly'
      },
      {
        path: 'active',
        loadComponent: () => import('./active/washer-active.component').then(m => m.WasherActiveComponent),
        title: 'Aktive Aufträge – Waschly'
      },
      {
        path: 'history',
        loadComponent: () => import('./history/washer-history.component').then(m => m.WasherHistoryComponent),
        title: 'Historie – Waschly'
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/washer-profile.component').then(m => m.WasherProfileComponent),
        title: 'Profil – Waschly'
      },
      {
        path: 'job/:id',
        loadComponent: () => import('./job/washer-job-detail.component').then(m => m.WasherJobDetailComponent),
        title: 'Auftrag – Waschly'
      }
    ]
  }
];
