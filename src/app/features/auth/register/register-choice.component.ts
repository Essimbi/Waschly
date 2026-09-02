import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-register-choice',
  standalone: true,
  imports: [CommonModule, RouterLink, AuthShellComponent, TranslatePipe],
  template: `
    <app-auth-shell [title]="'auth.registerChoice.title' | translate" [subtitle]="'auth.registerChoice.subtitle' | translate">
      <div class="space-y-4">
        <a routerLink="/register/client" class="group block rounded-2xl border-2 border-surface-3 hover:border-accent-500 bg-surface p-6 transition-all duration-200 hover:shadow-soft-md">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
            </div>
            <div class="flex-1">
              <p class="font-bold text-text-main">{{ 'auth.registerChoice.clientTitle' | translate }}</p>
              <p class="text-sm text-text-muted mt-0.5">{{ 'auth.registerChoice.clientSubtitle' | translate }}</p>
            </div>
            <svg class="w-5 h-5 text-text-muted group-hover:text-accent-600 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </a>

        <a routerLink="/register/washer" class="group block rounded-2xl border-2 border-surface-3 hover:border-aqua-500 bg-surface p-6 transition-all duration-200 hover:shadow-soft-md">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-aqua-50 text-aqua-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-4 6h16a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a1 1 0 011-1z"/></svg>
            </div>
            <div class="flex-1">
              <p class="font-bold text-text-main">{{ 'auth.registerChoice.washerTitle' | translate }}</p>
              <p class="text-sm text-text-muted mt-0.5">{{ 'auth.registerChoice.washerSubtitle' | translate }}</p>
            </div>
            <svg class="w-5 h-5 text-text-muted group-hover:text-aqua-600 group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </a>
      </div>

      <p class="text-center text-sm text-text-muted mt-8">
        {{ 'auth.registerChoice.alreadyAccount' | translate }}
        <a routerLink="/login" class="font-semibold text-accent-600 hover:text-accent-700">{{ 'auth.registerChoice.login' | translate }}</a>
      </p>
    </app-auth-shell>
  `
})
export class RegisterChoiceComponent {}
