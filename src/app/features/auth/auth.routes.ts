import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    title: 'Anmelden – Waschly'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Passwort vergessen – Waschly'
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register-choice.component').then(m => m.RegisterChoiceComponent),
    title: 'Registrieren – Waschly'
  },
  {
    path: 'register/client',
    loadComponent: () => import('./register/register-client.component').then(m => m.RegisterClientComponent),
    title: 'Als Kunde registrieren – Waschly'
  },
  {
    path: 'register/washer',
    loadComponent: () => import('./register/register-washer.component').then(m => m.RegisterWasherComponent),
    title: 'Als Wäscher registrieren – Waschly'
  }
];
