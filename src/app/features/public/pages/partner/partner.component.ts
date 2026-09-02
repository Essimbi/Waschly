import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/actions/button/button.component';
import { CardComponent } from '../../../../shared/ui/display/card/card.component';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { Tilt3DDirective } from '../../../../shared/ui/animations/tilt-3d.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, ScrollRevealDirective, Tilt3DDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Hero -->
      <div class="text-center max-w-4xl mx-auto mb-24" appScrollReveal>
        <h1 class="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl md:text-6xl">
          {{ 'partner.hero_title' | translate }}
        </h1>
        <p class="mt-6 text-xl text-text-muted">
          {{ 'partner.hero_subtitle' | translate }}
        </p>
        <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <app-button variant="primary" size="lg">{{ 'partner.hero_cta' | translate }}</app-button>
          <app-button variant="secondary" size="lg">{{ 'partner.hero_cta2' | translate }}</app-button>
        </div>
      </div>

      <!-- 4 Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32" appScrollReveal="{ delay: 200 }">
        <div class="text-center">
          <div class="text-4xl font-extrabold text-accent-600">{{ 'partner.stat1_value' | translate }}</div>
          <div class="mt-2 text-sm font-medium text-text-muted">{{ 'partner.stat1_label' | translate }}</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-extrabold text-accent-600">{{ 'partner.stat2_value' | translate }}</div>
          <div class="mt-2 text-sm font-medium text-text-muted">{{ 'partner.stat2_label' | translate }}</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-extrabold text-accent-600">{{ 'partner.stat3_value' | translate }}</div>
          <div class="mt-2 text-sm font-medium text-text-muted">{{ 'partner.stat3_label' | translate }}</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-extrabold text-accent-600">{{ 'partner.stat4_value' | translate }}</div>
          <div class="mt-2 text-sm font-medium text-text-muted">{{ 'partner.stat4_label' | translate }}</div>
        </div>
      </div>

      <!-- 3 Steps -->
      <div class="mb-32">
        <div class="text-center mb-16" appScrollReveal>
          <h2 class="text-3xl font-bold text-text-main">{{ 'partner.steps_title' | translate }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <!-- Decorative line for desktop -->
          <div class="hidden md:block absolute top-12 left-[15%] right-[15%] h-1 bg-surface-3 rounded-full"></div>
          
          <!-- Step 1 -->
          <div class="relative text-center" appScrollReveal="{ delay: 100 }">
            <div class="w-24 h-24 mx-auto bg-surface border-4 border-surface shadow-soft-md rounded-full flex items-center justify-center text-3xl font-bold text-accent-600 mb-6 relative z-10">1</div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.step1_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.step1_desc' | translate }}</p>
          </div>
          <!-- Step 2 -->
          <div class="relative text-center" appScrollReveal="{ delay: 200 }">
            <div class="w-24 h-24 mx-auto bg-surface border-4 border-surface shadow-soft-md rounded-full flex items-center justify-center text-3xl font-bold text-accent-600 mb-6 relative z-10">2</div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.step2_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.step2_desc' | translate }}</p>
          </div>
          <!-- Step 3 -->
          <div class="relative text-center" appScrollReveal="{ delay: 300 }">
            <div class="w-24 h-24 mx-auto bg-surface border-4 border-surface shadow-soft-md rounded-full flex items-center justify-center text-3xl font-bold text-accent-600 mb-6 relative z-10">3</div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.step3_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.step3_desc' | translate }}</p>
          </div>
        </div>
      </div>

      <!-- 6 Benefits -->
      <div class="mb-32">
        <div class="text-center mb-16" appScrollReveal>
          <h2 class="text-3xl font-bold text-text-main">{{ 'partner.benefits_title' | translate }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <app-card class="p-8 h-full flex flex-col" appScrollReveal="{ delay: 100 }" appTilt3D>
            <div class="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.b1_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.b1_desc' | translate }}</p>
          </app-card>
          
          <app-card class="p-8 h-full flex flex-col" appScrollReveal="{ delay: 200 }" appTilt3D>
            <div class="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.b2_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.b2_desc' | translate }}</p>
          </app-card>

          <app-card class="p-8 h-full flex flex-col" appScrollReveal="{ delay: 300 }" appTilt3D>
            <div class="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.b3_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.b3_desc' | translate }}</p>
          </app-card>
          
          <app-card class="p-8 h-full flex flex-col" appScrollReveal="{ delay: 100 }" appTilt3D>
            <div class="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.b4_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.b4_desc' | translate }}</p>
          </app-card>

          <app-card class="p-8 h-full flex flex-col" appScrollReveal="{ delay: 200 }" appTilt3D>
            <div class="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.b5_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.b5_desc' | translate }}</p>
          </app-card>

          <app-card class="p-8 h-full flex flex-col" appScrollReveal="{ delay: 300 }" appTilt3D>
            <div class="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center text-accent-600 mb-6">
              <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 class="text-xl font-bold text-text-main mb-3">{{ 'partner.b6_title' | translate }}</h3>
            <p class="text-text-muted">{{ 'partner.b6_desc' | translate }}</p>
          </app-card>
        </div>
      </div>

      <!-- Testimonials -->
      <div class="mb-32">
        <div class="text-center mb-16" appScrollReveal>
          <h2 class="text-3xl font-bold text-text-main">{{ 'partner.testimonials_title' | translate }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <app-card class="p-10 bg-surface border-surface-2" appScrollReveal="{ delay: 100 }">
            <svg class="w-10 h-10 text-accent-300 mb-6" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10.8 19.3c0-3.3 2.1-5.6 5.2-6.5L14.7 9H9c-3.1 3-4.5 6.7-4.5 11v3h6.3v-3.7zM26.8 19.3c0-3.3 2.1-5.6 5.2-6.5L30.7 9H25c-3.1 3-4.5 6.7-4.5 11v3h6.3v-3.7z"></path>
            </svg>
            <p class="text-lg text-text-main italic mb-8">"{{ 'partner.t1_text' | translate }}"</p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xl">M</div>
              <div>
                <div class="font-bold text-text-main">{{ 'partner.t1_name' | translate }}</div>
                <div class="text-sm text-text-muted">{{ 'partner.t1_role' | translate }}</div>
              </div>
            </div>
          </app-card>
          
          <app-card class="p-10 bg-surface border-surface-2" appScrollReveal="{ delay: 200 }">
            <svg class="w-10 h-10 text-accent-300 mb-6" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10.8 19.3c0-3.3 2.1-5.6 5.2-6.5L14.7 9H9c-3.1 3-4.5 6.7-4.5 11v3h6.3v-3.7zM26.8 19.3c0-3.3 2.1-5.6 5.2-6.5L30.7 9H25c-3.1 3-4.5 6.7-4.5 11v3h6.3v-3.7z"></path>
            </svg>
            <p class="text-lg text-text-main italic mb-8">"{{ 'partner.t2_text' | translate }}"</p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-700 font-bold text-xl">A</div>
              <div>
                <div class="font-bold text-text-main">{{ 'partner.t2_name' | translate }}</div>
                <div class="text-sm text-text-muted">{{ 'partner.t2_role' | translate }}</div>
              </div>
            </div>
          </app-card>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="bg-accent-600 rounded-3xl p-12 text-center text-white shadow-soft-xl relative overflow-hidden" appScrollReveal>
        <div class="relative z-10">
          <h2 class="text-3xl font-extrabold sm:text-4xl mb-4">{{ 'partner.cta_title' | translate }}</h2>
          <p class="text-xl text-accent-100 max-w-2xl mx-auto mb-10">{{ 'partner.cta_subtitle' | translate }}</p>
          <app-button variant="secondary" size="lg" class="text-accent-700 font-semibold">{{ 'partner.cta_button' | translate }}</app-button>
        </div>
        <!-- Decorative pattern -->
        <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 50% 50%, white 2px, transparent 2px); background-size: 32px 32px;"></div>
      </div>
      
    </div>
  `
})
export class PartnerComponent {}
