import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { OtpStepComponent } from '../otp-step/otp-step.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

type Step = 'email' | 'otp' | 'newPassword';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShellComponent, OtpStepComponent, ButtonComponent, TranslatePipe],
  template: `
    <app-auth-shell
      [title]="titleFor(step())"
      [subtitle]="subtitleFor(step())"
      [panelDescription]="'auth.forgotPassword.panelDescription' | translate">

      @if (step() === 'email') {
        <form (ngSubmit)="submitEmail()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.forgotPassword.email' | translate }}</label>
            <input
              type="email"
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              [placeholder]="'auth.forgotPassword.emailPlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none"
            />
          </div>
          <div class="pt-3">
            <app-button type="submit" variant="primary" class="w-full" [isLoading]="isSubmitting()">
              {{ 'auth.forgotPassword.submit' | translate }}
            </app-button>
          </div>
        </form>
        <p class="text-center text-sm text-text-muted mt-8">
          <a routerLink="/login" class="font-semibold text-accent-600 hover:text-accent-700">{{ 'auth.forgotPassword.backToLogin' | translate }}</a>
        </p>
      }

      @if (step() === 'otp') {
        <app-otp-step
          [email]="email()"
          [error]="otpError()"
          (completed)="onOtpCompleted($event)"
          (back)="step.set('email')"
        ></app-otp-step>
      }

      @if (step() === 'newPassword') {
        <form (ngSubmit)="submitNewPassword()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.forgotPassword.newPassword' | translate }}</label>
            <input type="password" [value]="newPassword()" (input)="newPassword.set($any($event.target).value)" [placeholder]="'auth.forgotPassword.passwordPlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.forgotPassword.newPasswordConfirm' | translate }}</label>
            <input type="password" [value]="newPasswordConfirm()" (input)="newPasswordConfirm.set($any($event.target).value)" [placeholder]="'auth.forgotPassword.passwordPlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
          </div>
          <div class="pt-3">
            <app-button type="submit" variant="primary" class="w-full" [isLoading]="isSubmitting()">
              {{ 'auth.forgotPassword.save' | translate }}
            </app-button>
          </div>
        </form>
      }
    </app-auth-shell>
  `
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  step = signal<Step>('email');
  email = signal('');
  newPassword = signal('');
  newPasswordConfirm = signal('');
  isSubmitting = signal(false);
  otpError = signal<string | null>(null);

  titleFor(step: Step): string {
    switch (step) {
      case 'email': return this.i18n.t('auth.forgotPassword.titleEmail');
      case 'newPassword': return this.i18n.t('auth.forgotPassword.titleNewPassword');
      default: return '';
    }
  }

  subtitleFor(step: Step): string {
    return step === 'email' ? this.i18n.t('auth.forgotPassword.subtitleEmail') : '';
  }

  submitEmail() {
    if (!this.email().trim() || !this.email().includes('@')) {
      this.toast.show('error', this.i18n.t('auth.forgotPassword.errEmail'));
      return;
    }
    this.isSubmitting.set(true);
    const result = this.authService.requestPasswordReset(this.email());
    this.isSubmitting.set(false);
    if (!result.ok) {
      this.toast.show('error', this.i18n.t(result.error!));
      return;
    }
    this.otpError.set(null);
    this.step.set('otp');
    this.toast.show('info', this.i18n.t('auth.forgotPassword.codeSentTo', { email: this.email() }));
  }

  onOtpCompleted(code: string) {
    const result = this.authService.verifyOtp(code);
    if (!result.ok) {
      this.otpError.set(this.i18n.t(result.error!));
      return;
    }
    this.otpError.set(null);
    this.step.set('newPassword');
  }

  submitNewPassword() {
    if (this.newPassword().length < 8) {
      this.toast.show('error', this.i18n.t('auth.forgotPassword.errPasswordLength'));
      return;
    }
    if (this.newPassword() !== this.newPasswordConfirm()) {
      this.toast.show('error', this.i18n.t('auth.forgotPassword.errPasswordMatch'));
      return;
    }
    this.isSubmitting.set(true);
    const result = this.authService.setNewPassword(this.newPassword());
    this.isSubmitting.set(false);
    if (!result.ok) {
      this.toast.show('error', this.i18n.t(result.error!));
      return;
    }
    this.toast.show('success', this.i18n.t('auth.forgotPassword.success'));
    const role = result.user!.role;
    this.router.navigateByUrl(role === 'washer' ? '/washer' : role === 'admin' ? '/admin' : '/client');
  }
}
