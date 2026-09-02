import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/actions/button/button.component';
import { RatingComponent } from '../../shared/ui/display/rating/rating.component';
import { AvatarComponent } from '../../shared/ui/display/avatar/avatar.component';
import { ScrollRevealDirective } from '../../shared/ui/animations/scroll-reveal.directive';
import { Tilt3DDirective } from '../../shared/ui/animations/tilt-3d.directive';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, RatingComponent, AvatarComponent, ScrollRevealDirective, Tilt3DDirective, TranslatePipe],
  template: `
    <div class="flex flex-col font-sans relative z-10">
      
      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-20 pb-12 md:pt-32 md:pb-24">
        <!-- Decoration background -->
        <div class="absolute inset-0 bg-gradient-to-br from-accent-50/60 to-transparent pointer-events-none dark:from-accent-900/20"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div class="space-y-8 text-center lg:text-left" appScrollReveal>
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-main tracking-tight leading-tight">
              {{ 'hero.title1' | translate }} <br/> <span class="text-accent-500">{{ 'hero.title2' | translate }}</span> <br/> {{ 'hero.title3' | translate }}
            </h1>
            <p class="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto lg:mx-0 font-light">
              {{ 'hero.subtitle' | translate }}
            </p>
            <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <app-button variant="primary" routerLink="/client" class="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl shadow-soft-md hover:shadow-soft-lg transform hover:-translate-y-1 transition-all duration-300">
                {{ 'hero.cta' | translate }}
              </app-button>
              <app-button variant="ghost" routerLink="/partner" class="w-full sm:w-auto h-14 px-8 text-lg font-medium text-text-muted hover:text-accent-500">
                {{ 'hero.ctaSecondary' | translate }}
              </app-button>
            </div>
          </div>
          
          <!-- Hero Illustration Mock -->
          <div class="relative max-w-xl mx-auto lg:ml-auto w-full group perspective-1000" appScrollReveal="{ delay: 200, direction: 'right' }" appTilt3D>
            <div class="absolute -inset-1 bg-gradient-to-r from-accent-400 to-sky-300 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative aspect-[4/3] bg-surface rounded-[2rem] border border-surface-2 shadow-soft-xl overflow-hidden flex items-center justify-center p-2">
              <img src="/landing_hero_illustration_1785839172943.jpg" class="w-full h-full object-cover rounded-3xl" alt="Washer cleaning a Tesla" onerror="this.src='https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop'">
            </div>
          </div>
        </div>
      </section>

      <!-- Stats Section -->
      <section class="py-16 bg-surface border-y border-surface-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center" appScrollReveal>
            <div>
              <p class="text-4xl md:text-5xl font-extrabold text-accent-500 mb-2">{{ 'stats.washers' | translate }}</p>
              <p class="text-text-muted font-medium uppercase tracking-wider text-sm">{{ 'stats.label_washers' | translate }}</p>
            </div>
            <div>
              <p class="text-4xl md:text-5xl font-extrabold text-accent-500 mb-2">{{ 'stats.cities' | translate }}</p>
              <p class="text-text-muted font-medium uppercase tracking-wider text-sm">{{ 'stats.label_cities' | translate }}</p>
            </div>
            <div>
              <p class="text-4xl md:text-5xl font-extrabold text-accent-500 mb-2">{{ 'stats.washes' | translate }}</p>
              <p class="text-text-muted font-medium uppercase tracking-wider text-sm">{{ 'stats.label_washes' | translate }}</p>
            </div>
            <div>
              <p class="text-4xl md:text-5xl font-extrabold text-accent-500 mb-2">{{ 'stats.rating' | translate }}</p>
              <p class="text-text-muted font-medium uppercase tracking-wider text-sm">{{ 'stats.label_rating' | translate }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How it works -->
      <section class="py-24 bg-surface-2 dark:bg-surface-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-20" appScrollReveal>
            <h2 class="text-4xl md:text-5xl font-bold text-text-main mb-6 tracking-tight">{{ 'howItWorks.title' | translate }}</h2>
            <p class="text-xl text-text-muted">{{ 'howItWorks.subtitle' | translate }}</p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (step of steps; track step.titleKey; let i = $index) {
              <div class="relative bg-surface p-8 rounded-3xl shadow-soft-sm hover:shadow-soft-md hover:-translate-y-2 transition-all duration-300 border border-surface-3 text-center flex flex-col items-center" [appScrollReveal]="{ delay: i * 100 }" appTilt3D>
                <div class="w-14 h-14 bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <div [innerHTML]="step.icon" class="w-7 h-7"></div>
                </div>
                <div class="absolute -top-4 -right-4 w-10 h-10 bg-accent-600 text-white font-bold rounded-full flex items-center justify-center shadow-soft-sm">{{ i + 1 }}</div>
                <h3 class="text-xl font-bold text-text-main mb-3">{{ step.titleKey | translate }}</h3>
                <p class="text-text-muted">{{ step.descKey | translate }}</p>
              </div>
            }
          </div>
        </div>
      </section>
      
      <!-- Press Section -->
      <section class="py-12 bg-surface border-y border-surface-3">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" appScrollReveal>
          <p class="text-sm font-semibold text-text-muted uppercase tracking-wider mb-8">{{ 'press.title' | translate }}</p>
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <div class="text-2xl font-black text-text-main tracking-tighter">TechCrunch</div>
            <div class="text-2xl font-black text-text-main tracking-tighter">WIRED</div>
            <div class="text-2xl font-black text-text-main tracking-tighter">Forbes</div>
            <div class="text-2xl font-black text-text-main tracking-tighter">AutoBild</div>
          </div>
        </div>
      </section>

      <!-- Trust Section -->
      <section class="py-24 bg-surface-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            @for (trust of trustFeatures; track trust.titleKey; let i = $index) {
              <div class="flex gap-5 p-8 rounded-3xl bg-surface hover:bg-surface-3 transition-colors group" [appScrollReveal]="{ delay: i * 100 }">
                <div class="w-14 h-14 bg-surface-2 rounded-2xl shadow-soft-xs flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <div [innerHTML]="trust.icon" class="w-7 h-7 text-accent-500"></div>
                </div>
                <div>
                  <h3 class="font-bold text-xl text-text-main mb-2">{{ trust.titleKey | translate }}</h3>
                  <p class="text-text-muted leading-relaxed">{{ trust.descKey | translate }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-24 bg-surface">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-4xl md:text-5xl font-bold mb-16 text-center tracking-tight text-text-main" appScrollReveal>{{ 'testimonials.title' | translate }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (review of reviews; track review.nameKey; let i = $index) {
              <div class="bg-surface-2 p-8 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300 border border-surface-3 hover:-translate-y-1" [appScrollReveal]="{ delay: i * 150 }">
                <app-rating [value]="review.rating" [readonly]="true" size="sm" class="mb-8 block"></app-rating>
                <p class="text-text-muted mb-8 italic text-lg leading-relaxed">"{{ review.textKey | translate }}"</p>
                <div class="flex items-center gap-4">
                  <app-avatar [src]="review.avatar" [name]="review.nameKey | translate" size="lg" class="ring-2 ring-surface-3 rounded-full"></app-avatar>
                  <div>
                    <p class="text-text-main font-bold">{{ review.nameKey | translate }}</p>
                    <p class="text-sm text-text-muted">{{ 'testimonials.verified' | translate }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- App Download CTA -->
      <section class="py-24 bg-surface-2 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-accent-500/10 to-transparent pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="bg-accent-600 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-soft-2xl overflow-hidden relative">
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <div class="lg:w-1/2 space-y-8 relative z-10 text-center lg:text-left" appScrollReveal>
              <span class="inline-block py-1 px-3 rounded-full bg-white/20 text-white text-sm font-semibold tracking-wider uppercase backdrop-blur-sm">
                {{ 'appCta.badge' | translate }}
              </span>
              <h2 class="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {{ 'appCta.title' | translate }}
              </h2>
              <p class="text-xl text-accent-50 font-medium">
                {{ 'appCta.subtitle' | translate }}
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <button class="bg-black text-white rounded-xl px-6 py-3 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors shadow-lg hover:-translate-y-1 transform duration-300">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.75 1.54.11 2.62.75 3.32 1.76-2.92 1.76-2.39 5.86.6 7.1-1.05 2.1-2.05 4.31-2.73 4.06zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                  </svg>
                  <div class="text-left">
                    <div class="text-[10px] uppercase tracking-wider opacity-80">Download on the</div>
                    <div class="text-lg font-semibold leading-none">{{ 'appCta.appStore' | translate }}</div>
                  </div>
                </button>
                <button class="bg-black text-white rounded-xl px-6 py-3 flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors shadow-lg hover:-translate-y-1 transform duration-300">
                  <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.6 20.9c-.3-.2-.5-.6-.5-1.1V4.2c0-.5.2-.9.5-1.1l11.4 11.4L3.6 20.9zM16 13.5l3.2 3.2-1.9 1c-1.3.7-2.6 1.4-3.9 2L16 13.5zM16 10.5L3.6 20.9l9.8-9.8 2.6-2.6-2.6-2.6 2.6 4.6zM21.2 13.5l-1.9 1-3.2-3.2 3.2-3.2 1.9 1c1.3.7 2.6 1.4 3.9 2-1.3.6-2.6 1.3-3.9 2z"/>
                  </svg>
                  <div class="text-left">
                    <div class="text-[10px] uppercase tracking-wider opacity-80">GET IT ON</div>
                    <div class="text-lg font-semibold leading-none">{{ 'appCta.playStore' | translate }}</div>
                  </div>
                </button>
              </div>
            </div>
            
            <div class="lg:w-1/2 relative z-10 flex justify-center lg:justify-end" appScrollReveal="{ delay: 200, direction: 'right' }" appTilt3D>
              <div class="relative w-64 h-auto aspect-[9/19] bg-black rounded-[3rem] border-8 border-black shadow-2xl overflow-hidden flex items-center justify-center">
                <div class="absolute top-0 w-32 h-6 bg-black rounded-b-3xl z-20"></div>
                <img src="/landing_hero_illustration_1785839172943.jpg" class="w-full h-full object-cover" alt="Waschly App">
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
})
export class LandingComponent {
  currentYear = new Date().getFullYear();

  steps = [
    { titleKey: 'howItWorks.step1_title', descKey: 'howItWorks.step1_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
    { titleKey: 'howItWorks.step2_title', descKey: 'howItWorks.step2_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
    { titleKey: 'howItWorks.step3_title', descKey: 'howItWorks.step3_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>' },
    { titleKey: 'howItWorks.step4_title', descKey: 'howItWorks.step4_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }
  ];

  trustFeatures = [
    { titleKey: 'trust.title1', descKey: 'trust.desc1', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' },
    { titleKey: 'trust.title2', descKey: 'trust.desc2', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>' },
    { titleKey: 'trust.title3', descKey: 'trust.desc3', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>' }
  ];

  reviews = [
    { nameKey: 'testimonials.review1_name', textKey: 'testimonials.review1_text', rating: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
    { nameKey: 'testimonials.review2_name', textKey: 'testimonials.review2_text', rating: 5, avatar: 'https://i.pravatar.cc/150?img=11' },
    { nameKey: 'testimonials.review3_name', textKey: 'testimonials.review3_text', rating: 4, avatar: 'https://i.pravatar.cc/150?img=20' }
  ];
}
