import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { SocialButtonsComponent } from '../social-buttons/social-buttons.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShellComponent, SocialButtonsComponent, ButtonComponent, TranslatePipe],
  template: `
    <app-auth-shell
      [title]="'auth.login.title' | translate"
      [subtitle]="'auth.login.subtitle' | translate"
      [panelDescription]="'auth.login.panelDescription' | translate">
      <form (ngSubmit)="submit()" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.login.email' | translate }}</label>
          <input
            type="email"
            [value]="email()"
            (input)="email.set($any($event.target).value)"
            [placeholder]="'auth.login.emailPlaceholder' | translate"
            class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
          />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="block text-sm font-medium text-gray-700">{{ 'auth.login.password' | translate }}</label>
            <a routerLink="/forgot-password" class="text-xs font-semibold text-accent-600 hover:text-accent-700">{{ 'auth.login.forgotPassword' | translate }}</a>
          </div>
          <input
            type="password"
            [value]="password()"
            (input)="password.set($any($event.target).value)"
            [placeholder]="'auth.login.passwordPlaceholder' | translate"
            class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
          />
        </div>
        <div class="pt-3">
          <app-button type="submit" variant="primary" class="w-full" [isLoading]="isSubmitting()">
            {{ 'auth.login.submit' | translate }}
          </app-button>
        </div>
      </form>

      <app-social-buttons [label]="'auth.login.socialLabel' | translate"></app-social-buttons>

      <p class="text-center text-sm text-text-muted mt-6">
        {{ 'auth.login.noAccount' | translate }}
        <a routerLink="/register" class="font-semibold text-accent-600 hover:text-accent-700">{{ 'auth.login.registerLink' | translate }}</a>
      </p>
    </app-auth-shell>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  email = signal('');
  password = signal('');
  isSubmitting = signal(false);

  submit() {
    if (!this.email().trim() || !this.email().includes('@')) {
      this.toast.show('error', this.i18n.t('auth.login.errEmail'));
      return;
    }
    if (!this.password()) {
      this.toast.show('error', this.i18n.t('auth.login.errPassword'));
      return;
    }
    this.isSubmitting.set(true);
    const result = this.authService.login(this.email(), this.password());
    this.isSubmitting.set(false);
    if (!result.ok) {
      this.toast.show('error', this.i18n.t(result.error!));
      return;
    }
    this.toast.show('success', this.i18n.t('auth.login.welcomeBack', { name: result.user!.firstName }));
    const target = result.user!.role === 'washer' ? '/washer' : result.user!.role === 'admin' ? '/admin' : '/client';
    this.router.navigateByUrl(target);
  }
}
