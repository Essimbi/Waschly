import { Component, Inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

const CONSENT_KEY = 'waschly_cookie_consent';
type ConsentChoice = 'accepted' | 'rejected';

@Component({
  selector: 'app-cookie-consent-banner',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, TranslatePipe],
  template: `
    @if (visible()) {
      <div class="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6 animate-fade-up" role="dialog" aria-live="polite" aria-label="Cookie consent">
        <div class="max-w-3xl mx-auto glass rounded-3xl shadow-soft-xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <p class="text-sm text-text-main leading-relaxed flex-1">
            {{ 'cookieConsent.text' | translate }}
            <a routerLink="/datenschutz" class="underline text-aqua-700 dark:text-aqua-400 hover:text-aqua-800">{{ 'cookieConsent.link' | translate }}</a>
          </p>
          <div class="flex gap-3 shrink-0 w-full sm:w-auto">
            <app-button variant="ghost" class="flex-1 sm:flex-none" (click)="choose('rejected')">
              {{ 'cookieConsent.reject' | translate }}
            </app-button>
            <app-button variant="primary" class="flex-1 sm:flex-none" (click)="choose('accepted')">
              {{ 'cookieConsent.accept' | translate }}
            </app-button>
          </div>
        </div>
      </div>
    }
  `
})
export class CookieConsentBannerComponent implements OnInit {
  visible = signal(false);
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser && !localStorage.getItem(CONSENT_KEY)) {
      this.visible.set(true);
    }
  }

  choose(choice: ConsentChoice) {
    if (this.isBrowser) {
      localStorage.setItem(CONSENT_KEY, choice);
    }
    this.visible.set(false);
  }
}
