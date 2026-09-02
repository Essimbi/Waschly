import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

interface FaqGroup {
  titleKey: string;
  items: { id: string; questionKey: string; answerKey: string; }[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16" appScrollReveal>
        <h1 class="font-display text-4xl font-semibold tracking-tight text-text-main sm:text-5xl">
          {{ 'faq.title' | translate }}
        </h1>
        <p class="mt-4 text-xl text-text-muted">
          {{ 'faq.subtitle' | translate }}
        </p>
      </div>
      
      <div class="space-y-12" appScrollReveal="{ delay: 200 }">
        <ng-container *ngFor="let group of faqGroups">
          <div>
            <h2 class="text-2xl font-bold text-text-main mb-6 pl-3 border-l-4 border-accent-500">
              {{ group.titleKey | translate }}
            </h2>
            <div class="space-y-4">
              <div *ngFor="let item of group.items"
                class="bg-surface rounded-2xl shadow-soft-sm overflow-hidden transition-all duration-300 border border-surface-2 hover:border-accent-200">
                <button 
                  (click)="toggle(item.id)"
                  class="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none">
                  <span class="text-lg font-semibold text-text-main pr-8">
                    {{ item.questionKey | translate }}
                  </span>
                  <span class="flex-shrink-0 ml-4">
                    <svg class="w-6 h-6 text-accent-500 transform transition-transform duration-300" 
                         [class.rotate-180]="openId() === item.id"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                <div 
                  class="px-6 overflow-hidden transition-all duration-300 ease-in-out"
                  [class.max-h-0]="openId() !== item.id"
                  [class.max-h-96]="openId() === item.id"
                  [class.pb-5]="openId() === item.id"
                  [class.opacity-0]="openId() !== item.id"
                  [class.opacity-100]="openId() === item.id">
                  <p class="text-text-muted leading-relaxed">
                    {{ item.answerKey | translate }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ng-container>
      </div>

      <div class="mt-20 text-center bg-surface-2 rounded-3xl p-10 shadow-soft-sm border border-surface-3" appScrollReveal="{ delay: 300 }">
        <h3 class="text-2xl font-bold text-text-main mb-4">{{ 'faq.contact_title' | translate }}</h3>
        <p class="text-text-muted mb-8">{{ 'faq.contact_subtitle' | translate }}</p>
        <button class="bg-accent-600 hover:bg-accent-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform hover:-translate-y-1">
          {{ 'faq.contact_button' | translate }}
        </button>
      </div>
    </div>
  `
})
export class FaqComponent {
  openId = signal<string | null>(null);

  faqGroups: FaqGroup[] = [
    {
      titleKey: 'faq.cat_general',
      items: [
        { id: 'g1', questionKey: 'faq.general_q1', answerKey: 'faq.general_a1' },
        { id: 'g2', questionKey: 'faq.general_q2', answerKey: 'faq.general_a2' },
        { id: 'g3', questionKey: 'faq.general_q3', answerKey: 'faq.general_a3' },
      ]
    },
    {
      titleKey: 'faq.cat_quality',
      items: [
        { id: 'q1', questionKey: 'faq.quality_q1', answerKey: 'faq.quality_a1' },
        { id: 'q2', questionKey: 'faq.quality_q2', answerKey: 'faq.quality_a2' },
        { id: 'q3', questionKey: 'faq.quality_q3', answerKey: 'faq.quality_a3' },
      ]
    },
    {
      titleKey: 'faq.cat_partner',
      items: [
        { id: 'p1', questionKey: 'faq.partner_q1', answerKey: 'faq.partner_a1' },
      ]
    },
    {
      titleKey: 'faq.cat_billing',
      items: [
        { id: 'b1', questionKey: 'faq.billing_q1', answerKey: 'faq.billing_a1' },
      ]
    }
  ];

  toggle(id: string) {
    if (this.openId() === id) {
      this.openId.set(null);
    } else {
      this.openId.set(id);
    }
  }
}
