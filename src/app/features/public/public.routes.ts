import { Routes } from '@angular/router';

export const PUBLIC_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('../landing/landing.component').then(m => m.LandingComponent),
        title: 'Waschly – Ihr Auto. Blitzsauber. In Minuten.'
      },
      {
        path: 'pricing',
        loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent),
        title: 'Waschly – Preise & Abos'
      },
      {
        path: 'partner',
        loadComponent: () => import('./pages/partner/partner.component').then(m => m.PartnerComponent),
        title: 'Waschly – Partner werden'
      },
      {
        path: 'faq',
        loadComponent: () => import('./pages/faq/faq.component').then(m => m.FaqComponent),
        title: 'Waschly – Häufige Fragen'
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
        title: 'Waschly – Über uns'
      }
    ]
  }
];
