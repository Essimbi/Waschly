import { Routes } from '@angular/router';
import { ClientComponent } from './client.component';

export const CLIENT_ROUTES: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/client-dashboard.component').then(m => m.ClientDashboardComponent),
        title: 'Dashboard – Waschly'
      },
      {
        path: 'history',
        loadComponent: () => import('./history/client-history.component').then(m => m.ClientHistoryComponent),
        title: 'Historie – Waschly'
      },
      {
        path: 'new',
        loadComponent: () => import('./demand-create/demand-create.component').then(m => m.DemandCreateComponent),
        title: 'Neue Wäsche – Waschly'
      },
      {
        path: 'track/:id',
        loadComponent: () => import('./demand-tracking/demand-tracking.component').then(m => m.DemandTrackingComponent),
        title: 'Tracking – Waschly'
      },
      {
        path: 'validate/:id',
        loadComponent: () => import('./validate/client-validate.component').then(m => m.ClientValidateComponent),
        title: 'Wäsche abschließen – Waschly'
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/client-profile.component').then(m => m.ClientProfileComponent),
        title: 'Profil – Waschly'
      }
    ]
  }
];
