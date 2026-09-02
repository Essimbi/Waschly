import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../../shared/ui/actions/button/button.component';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

interface PriceRow {
  labelKey: string;
  compact: number;
  sedan: number;
  suv: number;
  van: number;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, ScrollRevealDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-16" appScrollReveal>
        <h1 class="font-display text-4xl font-semibold tracking-tight text-text-main sm:text-5xl">
          {{ 'pricing.title' | translate }}
        </h1>
        <p class="mt-6 text-xl text-text-muted">
          {{ 'pricing.subtitle' | translate }}
        </p>
      </div>

      <!-- Per-wash pricing table -->
      <div class="overflow-x-auto rounded-3xl border border-surface-2 shadow-soft-sm" appScrollReveal>
        <table class="w-full text-left min-w-[560px]">
          <thead class="bg-surface-2">
            <tr>
              <th class="p-5 text-sm font-bold text-text-main">{{ 'pricing.table_washType' | translate }}</th>
              <th class="p-5 text-sm font-bold text-text-main text-center">{{ 'pricing.vehicle_compact' | translate }}</th>
              <th class="p-5 text-sm font-bold text-text-main text-center">{{ 'pricing.vehicle_sedan' | translate }}</th>
              <th class="p-5 text-sm font-bold text-text-main text-center">{{ 'pricing.vehicle_suv' | translate }}</th>
              <th class="p-5 text-sm font-bold text-text-main text-center">{{ 'pricing.vehicle_van' | translate }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-surface-2 bg-surface">
            @for (row of priceRows; track row.labelKey) {
              <tr class="hover:bg-surface-2/50 transition-colors">
                <td class="p-5 font-semibold text-text-main">{{ row.labelKey | translate }}</td>
                <td class="p-5 text-center font-bold text-accent-600">{{ row.compact }} €</td>
                <td class="p-5 text-center font-bold text-accent-600">{{ row.sedan }} €</td>
                <td class="p-5 text-center font-bold text-accent-600">{{ row.suv }} €</td>
                <td class="p-5 text-center font-bold text-accent-600">{{ row.van }} €</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <p class="text-sm text-text-muted mt-4 text-center">{{ 'pricing.table_note' | translate }}</p>

      <div class="text-center mt-10" appScrollReveal>
        <app-button variant="primary" size="lg" routerLink="/register/client">
          {{ 'pricing.cta' | translate }}
        </app-button>
      </div>

      <!-- Sparpaket -->
      <div class="mt-16 bg-aqua-50 dark:bg-aqua-900/20 border border-aqua-200 dark:border-aqua-800/40 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6" appScrollReveal>
        <div class="w-16 h-16 rounded-2xl bg-aqua-100 dark:bg-aqua-900/40 text-aqua-600 flex items-center justify-center shrink-0">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>
        </div>
        <div class="flex-1 text-center md:text-left">
          <h3 class="text-xl font-bold text-text-main">{{ 'pricing.bundle_title' | translate }}</h3>
          <p class="text-text-muted mt-1">{{ 'pricing.bundle_desc' | translate }}</p>
        </div>
      </div>

      <!-- Guarantee -->
      <div class="mt-8 bg-surface rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between shadow-soft-sm border border-surface-2" appScrollReveal>
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
      <div class="mt-24 max-w-4xl mx-auto" appScrollReveal>
        <h2 class="font-display text-3xl font-semibold text-center text-text-main mb-12">{{ 'pricing.faq_title' | translate }}</h2>
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
  priceRows: PriceRow[] = [
    { labelKey: 'pricing.wash_exterior', compact: 19, sedan: 22, suv: 27, van: 32 },
    { labelKey: 'pricing.wash_interior', compact: 25, sedan: 29, suv: 35, van: 39 },
    { labelKey: 'pricing.wash_full', compact: 39, sedan: 45, suv: 55, van: 65 },
  ];
}
