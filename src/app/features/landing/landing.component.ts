import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/actions/button/button.component';
import { RatingComponent } from '../../shared/ui/display/rating/rating.component';
import { AvatarComponent } from '../../shared/ui/display/avatar/avatar.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, RatingComponent, AvatarComponent],
  template: `
    <div class="min-h-screen bg-page flex flex-col font-sans">
      
      <!-- Top Nav -->
      <nav class="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div class="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="font-bold text-xl text-gray-900 tracking-tight">Waschly</span>
          </div>
          <div class="flex items-center gap-4">
            <a routerLink="/auth" class="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Login</a>
            <app-button variant="primary" routerLink="/client" class="hidden sm:inline-flex">Buchen</app-button>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="relative overflow-hidden bg-white py-12 md:py-24">
        <!-- Decoration background -->
        <div class="absolute inset-0 bg-gradient-to-br from-accent-50/60 to-transparent pointer-events-none"></div>
        <div class="max-w-6xl mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="space-y-8 text-center lg:text-left">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Ihr Auto. <br/> <span class="text-accent-600">Blitzsauber.</span> <br/> In Minuten.
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Der On-Demand-Waschservice für Ihr Fahrzeug. Wir kommen zu Ihnen – ob ins Büro oder nach Hause.
            </p>
            <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <app-button variant="primary" routerLink="/client" class="w-full sm:w-auto h-12 px-8 text-lg rounded-xl">
                Jetzt Waschen bestellen
              </app-button>
              <app-button variant="ghost" routerLink="/washer" class="w-full sm:w-auto h-12 px-8 text-lg font-medium text-gray-600 hover:text-accent-700">
                Wäscher werden &rarr;
              </app-button>
            </div>
          </div>
          
          <!-- Hero Illustration Mock -->
          <div class="relative max-w-lg mx-auto lg:ml-auto w-full group">
            <div class="absolute -inset-1 bg-gradient-to-r from-accent-400 to-sky-300 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative aspect-[4/3] bg-white rounded-[2rem] border border-gray-100 shadow-soft-lg overflow-hidden flex items-center justify-center p-2">
              <img src="/landing_hero_illustration_1785839172943.jpg" class="w-full h-full object-cover rounded-3xl" alt="Washer cleaning a Tesla" onerror="this.src='https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop'">
            </div>
          </div>

        </div>
      </section>

      <!-- How it works -->
      <section class="py-20 bg-[#F4F7FD]">
        <div class="max-w-6xl mx-auto px-4 md:px-6">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">So funktioniert's</h2>
            <p class="text-lg text-gray-600">In 4 einfachen Schritten zu einem sauberen Auto, ohne den Parkplatz zu verlassen.</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (step of steps; track step.title; let i = $index) {
              <div class="relative bg-white p-8 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-[box-shadow] duration-300 border border-gray-100 text-center flex flex-col items-center">
                <div class="w-12 h-12 bg-accent-50 text-accent-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <div [innerHTML]="step.icon" class="w-6 h-6"></div>
                </div>
                <div class="absolute -top-4 -right-4 w-8 h-8 bg-accent-700 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-md">{{ i + 1 }}</div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ step.title }}</h3>
                <p class="text-gray-600">{{ step.desc }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 md:px-6">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            @for (trust of trustFeatures; track trust.title) {
              <div class="flex gap-4 p-6 rounded-3xl bg-accent-50/40 hover:bg-accent-50/80 transition-colors">
                <div class="w-12 h-12 bg-white rounded-xl shadow-soft-xs flex items-center justify-center shrink-0">
                  <div [innerHTML]="trust.icon" class="w-6 h-6 text-accent-600"></div>
                </div>
                <div>
                  <h3 class="font-bold text-lg text-gray-900 mb-1">{{ trust.title }}</h3>
                  <p class="text-sm text-gray-600">{{ trust.desc }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 md:px-6">
          <h2 class="text-3xl md:text-4xl font-bold mb-12 text-center tracking-tight text-gray-900">Das sagen unsere Kunden</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            @for (review of reviews; track review.name) {
              <div class="bg-accent-50/50 p-8 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-[box-shadow] duration-300 border-0">
                <app-rating [value]="review.rating" [readonly]="true" size="sm" class="mb-6 block"></app-rating>
                <p class="text-gray-600 mb-8 italic">"{{ review.text }}"</p>
                <div class="flex items-center gap-3">
                  <app-avatar [src]="review.avatar" [name]="review.name" size="lg" class="ring-2 ring-accent-100 rounded-full"></app-avatar>
                  <div>
                    <p class="text-gray-900 font-bold">{{ review.name }}</p>
                    <p class="text-xs text-gray-500">Verifizierter Kunde</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="bg-[#F4F7FD] border-t border-gray-100 py-12 text-center">
        <div class="max-w-6xl mx-auto px-4 md:px-6">
          <div class="flex items-center justify-center gap-2 mb-6">
            <div class="w-6 h-6 bg-accent-600 rounded-lg flex items-center justify-center">
              <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <span class="font-bold text-lg text-gray-900 tracking-tight">Waschly</span>
          </div>
          <div class="flex flex-wrap justify-center gap-6 mb-8 text-sm font-medium text-gray-500">
            <a href="#" class="hover:text-gray-900 transition-colors duration-200">Datenschutz</a>
            <a href="#" class="hover:text-gray-900 transition-colors duration-200">Impressum</a>
            <a href="#" class="hover:text-gray-900 transition-colors duration-200">AGB</a>
          </div>
          <p class="text-gray-500 text-sm">© {{ currentYear }} Waschly GmbH. Alle Rechte vorbehalten.</p>
        </div>
      </footer>
    </div>
  `
})
export class LandingComponent {
  currentYear = new Date().getFullYear();

  steps = [
    { title: 'Anfrage stellen', desc: 'Wählen Sie Ihren Standort und Ihre Waschpräferenz.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
    { title: 'Wäscher kommt', desc: 'Ein verifizierter Wäscher nimmt den Auftrag an und fährt zu Ihnen.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
    { title: 'Auto wird gewaschen', desc: 'Umweltfreundliche Reinigung direkt vor Ort.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>' },
    { title: 'Bewerten & Bezahlen', desc: 'Bequem per App bezahlen und Service bewerten.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }
  ];

  trustFeatures = [
    { title: 'Verifizierte Wäscher', desc: 'Alle Waschpartner durchlaufen einen strengen ID- und Background-Check.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' },
    { title: 'Echtzeit-Tracking', desc: 'Verfolgen Sie den Status und Standort Ihres Wäschers live auf der Karte.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>' },
    { title: 'Zufriedenheitsgarantie', desc: 'Nur bezahlen, wenn Sie zu 100% mit dem Ergebnis zufrieden sind.', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>' }
  ];

  reviews = [
    { name: 'Julia Wagner', rating: 5, text: 'Fantastischer Service! Ich war im Büro, kam raus und mein Auto sah aus wie neu. Sehr empfehlenswert!', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Thomas Becker', rating: 5, text: 'Die App ist super einfach zu bedienen und der Wäscher war überpünktlich. Klasse.', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Sophie Richter', rating: 4, text: 'Sehr praktisch für Leute mit wenig Zeit. Ein Stern Abzug, weil es am Anfang regnete, aber das Ergebnis war trotzdem top.', avatar: 'https://i.pravatar.cc/150?img=20' }
  ];
}
