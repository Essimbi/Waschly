import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-impressum',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-16" appScrollReveal>
        <h1 class="font-display text-4xl font-semibold tracking-tight text-text-main sm:text-5xl mb-6">
          {{ 'legal.impressum.title' | translate }}
        </h1>
        <div class="rounded-2xl bg-aqua-50 dark:bg-aqua-900/20 border border-aqua-200 dark:border-aqua-800/40 px-6 py-4 text-sm text-aqua-800 dark:text-aqua-200">
          {{ 'legal.templateNotice' | translate }}
        </div>
      </div>

      <div class="space-y-12">
        @for (section of sections; track section.titleKey) {
          <div appScrollReveal>
            <h2 class="text-xl font-bold text-text-main mb-3">{{ section.titleKey | translate }}</h2>
            <p class="text-text-muted leading-relaxed whitespace-pre-line">{{ section.bodyKey | translate }}</p>
          </div>
        }
      </div>
    </div>
  `
})
export class ImpressumComponent {
  sections = [
    { titleKey: 'legal.impressum.s1_title', bodyKey: 'legal.impressum.s1_body' },
    { titleKey: 'legal.impressum.s2_title', bodyKey: 'legal.impressum.s2_body' },
    { titleKey: 'legal.impressum.s3_title', bodyKey: 'legal.impressum.s3_body' },
    { titleKey: 'legal.impressum.s4_title', bodyKey: 'legal.impressum.s4_body' },
    { titleKey: 'legal.impressum.s5_title', bodyKey: 'legal.impressum.s5_body' },
    { titleKey: 'legal.impressum.s6_title', bodyKey: 'legal.impressum.s6_body' },
  ];
}
