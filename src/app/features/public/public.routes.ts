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
        title: 'Waschly – Preise'
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
      },
      {
        path: 'offers',
        loadComponent: () => import('./pages/offers/offers.component').then(m => m.OffersComponent),
        title: 'Waschly – Aktuelle Anfragen'
      },
      {
        path: 'impressum',
        loadComponent: () => import('./pages/legal/impressum.component').then(m => m.ImpressumComponent),
        title: 'Waschly – Impressum'
      },
      {
        path: 'datenschutz',
        loadComponent: () => import('./pages/legal/datenschutz.component').then(m => m.DatenschutzComponent),
        title: 'Waschly – Datenschutz'
      },
      {
        path: 'agb',
        loadComponent: () => import('./pages/legal/agb.component').then(m => m.AgbComponent),
        title: 'Waschly – AGB'
      }
    ]
  }
];
