import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

/**
 * Split-screen layout shared by /login, /forgot-password and /register/* screens:
 * a branded wave-edged panel on the left, the form on the right.
 */
@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  template: `
    <div class="min-h-screen bg-page flex items-center justify-center p-4 sm:p-6">
      <div class="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-[2rem] shadow-soft-xl overflow-hidden bg-surface min-h-[640px]">

        <!-- Brand panel -->
        <div class="relative hidden lg:flex flex-col justify-between p-10 xl:p-12 text-white bg-gradient-to-br from-accent-700 via-accent-600 to-accent-500">
          <div class="relative z-10">
            <a routerLink="/" class="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm font-medium mb-16">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              {{ 'auth.shell.backHome' | translate }}
            </a>

            <p class="text-sm font-medium text-accent-100 uppercase tracking-widest mb-6">{{ 'auth.shell.welcomeTo' | translate }}</p>

            <div class="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg mb-6">
              <svg class="w-8 h-8 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>

            <h1 class="font-display text-3xl xl:text-4xl font-semibold tracking-tight mb-4">Waschly</h1>
            <p class="text-accent-50 leading-relaxed max-w-xs">{{ panelDescription() || ('auth.shell.defaultPanelDescription' | translate) }}</p>
          </div>

          <div class="relative z-10 flex items-center gap-4 text-sm text-accent-100">
            <a routerLink="/offers" class="hover:text-white transition-colors">{{ 'auth.shell.viewOffers' | translate }}</a>
            <span class="opacity-40">|</span>
            <a routerLink="/faq" class="hover:text-white transition-colors">{{ 'auth.shell.help' | translate }}</a>
          </div>
        </div>

        <!-- Layered wave edge, straddling the boundary between the two panels -->
        <svg class="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 h-full w-28 xl:w-36 pointer-events-none" viewBox="0 0 120 900" preserveAspectRatio="none" aria-hidden="true">
          <path [attr.d]="wavePath(52)" fill="#BFDBFE" opacity="0.6"></path>
          <path [attr.d]="wavePath(34)" fill="#60A5FA" opacity="0.75"></path>
          <path [attr.d]="wavePath(16)" fill="#2F67B1"></path>
        </svg>

        <!-- Form panel -->
        <div class="relative z-10 p-8 sm:p-12 flex flex-col justify-center">
          <div class="flex justify-end mb-2">
            <button
              type="button"
              (click)="toggleLanguage()"
              class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium text-text-muted hover:text-text-main bg-surface-2 hover:bg-surface-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500"
              aria-label="Toggle language">
              {{ currentLang() === 'de' ? '🇩🇪' : '🇬🇧' }}
            </button>
          </div>
          @if (title()) {
            <div class="mb-8">
              <h2 class="font-display text-2xl sm:text-3xl font-semibold text-text-main">{{ title() }}</h2>
              @if (subtitle()) {
                <p class="text-text-muted mt-2">{{ subtitle() }}</p>
              }
            </div>
          }
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `
})
export class AuthShellComponent {
  private i18n = inject(I18nService);
  currentLang = this.i18n.currentLang;

  title = input<string>('');
  subtitle = input<string>('');
  panelDescription = input<string>('');

  toggleLanguage() {
    this.i18n.toggleLanguage();
  }

  /**
   * Generates a smooth vertical wave: a solid fill from x=0 up to an oscillating right
   * edge (S-curves through alternating +/- amplitude points). Used at increasing amplitude
   * and decreasing saturation to build the layered scalloped boundary of the brand panel.
   */
  wavePath(amplitude: number): string {
    const centerX = 60;
    const height = 900;
    const waveCount = 4;
    const step = height / waveCount;

    const points = Array.from({ length: waveCount + 1 }, (_, i) => ({
      x: centerX + (i % 2 === 0 ? amplitude : -amplitude),
      y: i * step
    }));

    let d = `M0,0 L${points[0].x},${points[0].y} `;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midY = (prev.y + curr.y) / 2;
      d += `C ${prev.x},${midY} ${curr.x},${midY} ${curr.x},${curr.y} `;
    }
    d += `L0,${height} Z`;
    return d;
  }
}
