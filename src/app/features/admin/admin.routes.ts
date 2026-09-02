import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Dashboard – Admin'
      },
      {
        path: 'verifications',
        loadComponent: () => import('./verifications/admin-verifications.component').then(m => m.AdminVerificationsComponent),
        title: 'Verifizierungen – Admin'
      },
      {
        path: 'users',
        loadComponent: () => import('./users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'Nutzer – Admin'
      },
      {
        path: 'disputes',
        loadComponent: () => import('./disputes/admin-disputes.component').then(m => m.AdminDisputesComponent),
        title: 'Litigation – Admin'
      }
    ]
  }
];
