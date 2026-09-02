import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/ui/actions/button/button.component';
import { CardComponent } from '../../../../shared/ui/display/card/card.component';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { Tilt3DDirective } from '../../../../shared/ui/animations/tilt-3d.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CardComponent, ScrollRevealDirective, Tilt3DDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-12" appScrollReveal>
        <h1 class="text-4xl font-extrabold tracking-tight text-text-main sm:text-5xl md:text-6xl">
          {{ 'pricing.title' | translate }}
        </h1>
        <p class="mt-6 text-xl text-text-muted">
          {{ 'pricing.subtitle' | translate }}
        </p>
        
        <!-- Toggle -->
        <div class="mt-12 flex justify-center items-center gap-4 text-sm">
          <span [class.text-text-main]="!isYearly()" [class.text-text-muted]="isYearly()" class="font-semibold text-lg">{{ 'pricing.monthly' | translate }}</span>
          
          <button type="button" class="relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                  [class.bg-accent-600]="isYearly()" [class.bg-surface-3]="!isYearly()"
                  (click)="isYearly.set(!isYearly())"
                  role="switch" [attr.aria-checked]="isYearly()">
            <span class="pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  [class.translate-x-6]="isYearly()" [class.translate-x-0]="!isYearly()"></span>
          </button>
          
          <span [class.text-text-main]="isYearly()" [class.text-text-muted]="!isYearly()" class="font-semibold text-lg flex items-center gap-2">
            {{ 'pricing.yearly' | translate }}
            <span class="inline-flex items-center rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-bold text-accent-800 uppercase tracking-wide">
              {{ 'pricing.savings' | translate }}
            </span>
          </span>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 items-stretch">
        <!-- Basic -->
        <app-card class="relative flex flex-col p-8" appScrollReveal="{ delay: 100 }" appTilt3D>
          <h3 class="text-xl font-semibold text-text-main">{{ 'pricing.basic_name' | translate }}</h3>
          <p class="mt-6 flex items-baseline text-5xl font-extrabold text-text-main">
            {{ 'pricing.basic_price_monthly' | translate }}
            <span class="ml-2 text-xl font-medium text-text-muted">{{ 'pricing.perWash' | translate }}</span>
          </p>
          <ul class="mt-10 space-y-5 flex-1">
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.basic_f1' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.basic_f2' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.basic_f3' | translate }}</span>
            </li>
          </ul>
          <div class="mt-10">
            <app-button variant="secondary" class="w-full justify-center">{{ 'pricing.selectPlan' | translate }}</app-button>
          </div>
        </app-card>

        <!-- Premium -->
        <app-card class="relative flex flex-col p-8 border-2 border-accent-500 md:scale-105 z-10 shadow-soft-xl" appScrollReveal="{ delay: 200 }" appTilt3D>
          <div class="absolute -top-4 left-1/2 -translate-x-1/2">
            <span class="bg-accent-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-md">
              {{ 'pricing.popular' | translate }}
            </span>
          </div>
          <h3 class="text-xl font-semibold text-text-main">{{ 'pricing.premium_name' | translate }}</h3>
          <p class="mt-6 flex items-baseline text-5xl font-extrabold text-text-main">
            {{ 'pricing.premium_price_monthly' | translate }}
            <span class="ml-2 text-xl font-medium text-text-muted">{{ 'pricing.perWash' | translate }}</span>
          </p>
          <ul class="mt-10 space-y-5 flex-1">
            <li class="flex gap-4 text-text-main font-medium">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.premium_f1' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.premium_f2' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.premium_f3' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.premium_f4' | translate }}</span>
            </li>
          </ul>
          <div class="mt-10">
            <app-button variant="primary" class="w-full justify-center">{{ 'pricing.bookNow' | translate }}</app-button>
          </div>
        </app-card>

        <!-- Ultimate -->
        <app-card class="relative flex flex-col p-8" appScrollReveal="{ delay: 300 }" appTilt3D>
          <h3 class="text-xl font-semibold text-text-main">{{ 'pricing.ultimate_name' | translate }}</h3>
          <p class="mt-6 flex items-baseline text-5xl font-extrabold text-text-main">
            {{ 'pricing.ultimate_price_monthly' | translate }}
            <span class="ml-2 text-xl font-medium text-text-muted">{{ 'pricing.perWash' | translate }}</span>
          </p>
          <ul class="mt-10 space-y-5 flex-1">
            <li class="flex gap-4 text-text-main font-medium">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.ultimate_f1' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.ultimate_f2' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.ultimate_f3' | translate }}</span>
            </li>
            <li class="flex gap-4 text-text-main">
              <svg class="h-6 w-6 flex-shrink-0 text-accent-500" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
              <span>{{ 'pricing.ultimate_f4' | translate }}</span>
            </li>
          </ul>
          <div class="mt-10">
            <app-button variant="secondary" class="w-full justify-center">{{ 'pricing.selectPlan' | translate }}</app-button>
          </div>
        </app-card>
      </div>
      
      <!-- Guarantee -->
      <div class="mt-24 bg-surface rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between shadow-soft-sm border border-surface-2" appScrollReveal>
        <div class="mb-8 md:mb-0 md:mr-10">
          <h3 class="text-2xl font-bold text-text-main">{{ 'pricing.guarantee_title' | translate }}</h3>
          <p class="mt-4 text-lg text-text-muted">{{ 'pricing.guarantee_desc' | translate }}</p>
        </div>
        <div class="flex-shrink-0">
          <svg class="w-24 h-24 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-32 max-w-4xl mx-auto" appScrollReveal>
        <h2 class="text-3xl font-extrabold text-center text-text-main mb-12">{{ 'pricing.faq_title' | translate }}</h2>
        <div class="space-y-6">
          <div class="bg-surface rounded-2xl p-8 shadow-soft-sm border border-surface-2">
            <h4 class="text-xl font-bold text-text-main">{{ 'pricing.faq1_q' | translate }}</h4>
            <p class="mt-4 text-text-muted leading-relaxed">{{ 'pricing.faq1_a' | translate }}</p>
          </div>
          <div class="bg-surface rounded-2xl p-8 shadow-soft-sm border border-surface-2">
            <h4 class="text-xl font-bold text-text-main">{{ 'pricing.faq2_q' | translate }}</h4>
            <p class="mt-4 text-text-muted leading-relaxed">{{ 'pricing.faq2_a' | translate }}</p>
          </div>
          <div class="bg-surface rounded-2xl p-8 shadow-soft-sm border border-surface-2">
            <h4 class="text-xl font-bold text-text-main">{{ 'pricing.faq3_q' | translate }}</h4>
            <p class="mt-4 text-text-muted leading-relaxed">{{ 'pricing.faq3_a' | translate }}</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PricingComponent {
  isYearly = signal(false);
}

