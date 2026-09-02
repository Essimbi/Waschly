import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

/**
 * Row of social sign-in buttons shown on Login/Register screens.
 * No OAuth provider is wired up yet — clicking surfaces an honest
 * "not available yet" toast instead of silently doing nothing.
 *
 * Icons are written directly in the template (not bound via [innerHTML]) —
 * Angular's default sanitizer strips <svg>/<path> content from [innerHTML].
 */
@Component({
  selector: 'app-social-buttons',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
      <div class="relative flex justify-center text-xs">
        <span class="bg-surface px-3 text-text-muted">{{ label() ?? ('auth.social.defaultLabel' | translate) }}</span>
      </div>
    </div>
    <div class="flex items-center justify-center gap-3">
      <button type="button" (click)="notify('Facebook')" [attr.aria-label]="'auth.social.facebook' | translate"
        class="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#1877F2" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
      </button>
      <button type="button" (click)="notify('X')" [attr.aria-label]="'auth.social.x' | translate"
        class="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-800 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      </button>
      <button type="button" (click)="notify('Google')" [attr.aria-label]="'auth.social.google' | translate"
        class="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
        <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M21.35 11.1h-9.17v2.98h5.27c-.23 1.4-1.6 4.1-5.27 4.1a5.7 5.7 0 010-11.4c1.6 0 2.98.6 3.98 1.55l2.5-2.4C17.16 4.1 14.9 3 12.18 3a9 9 0 100 18c5.2 0 8.63-3.65 8.63-8.79 0-.59-.06-1.05-.14-1.5z"/></svg>
      </button>
      <button type="button" (click)="notify('Apple')" [attr.aria-label]="'auth.social.apple' | translate"
        class="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.85 3.73-.75 1.54.11 2.62.75 3.32 1.76-2.92 1.76-2.39 5.86.6 7.1-1.05 2.1-2.05 4.31-2.73 4.06zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
      </button>
    </div>
  `
})
export class SocialButtonsComponent {
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  /** When unset, falls back to the translated default label. */
  label = input<string | null>(null);

  notify(providerName: string) {
    this.toast.show('info', this.i18n.t('auth.social.notAvailable', { provider: providerName }));
  }
}
