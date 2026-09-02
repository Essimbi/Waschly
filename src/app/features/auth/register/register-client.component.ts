import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { OtpStepComponent } from '../otp-step/otp-step.component';
import { StepIndicatorComponent } from '../step-indicator/step-indicator.component';
import { SocialButtonsComponent } from '../social-buttons/social-buttons.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

type Step = 'personal' | 'otp';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShellComponent, OtpStepComponent, StepIndicatorComponent, SocialButtonsComponent, ButtonComponent, TranslatePipe],
  template: `
    <app-auth-shell
      [title]="step() === 'personal' ? ('auth.registerClient.title' | translate) : ''"
      [subtitle]="step() === 'personal' ? ('auth.registerClient.subtitle' | translate) : ''"
      [panelDescription]="'auth.registerClient.panelDescription' | translate">

      <app-step-indicator [steps]="stepLabels()" [current]="stepIndex()"></app-step-indicator>

      @if (step() === 'personal') {
        <form (ngSubmit)="submit()" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerClient.firstName' | translate }}</label>
              <input type="text" [value]="firstName()" (input)="firstName.set($any($event.target).value)"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerClient.lastName' | translate }}</label>
              <input type="text" [value]="lastName()" (input)="lastName.set($any($event.target).value)"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerClient.email' | translate }}</label>
            <input type="email" [value]="email()" (input)="email.set($any($event.target).value)" [placeholder]="'auth.registerClient.emailPlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerClient.phone' | translate }}</label>
            <input type="tel" [value]="phone()" (input)="phone.set($any($event.target).value)" [placeholder]="'auth.registerClient.phonePlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerClient.password' | translate }}</label>
              <input type="password" [value]="password()" (input)="password.set($any($event.target).value)" [placeholder]="'auth.registerClient.passwordPlaceholder' | translate"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerClient.passwordConfirm' | translate }}</label>
              <input type="password" [value]="passwordConfirm()" (input)="passwordConfirm.set($any($event.target).value)" [placeholder]="'auth.registerClient.passwordPlaceholder' | translate"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none" />
            </div>
          </div>

          <div class="pt-3">
            <app-button type="submit" variant="primary" class="w-full" [isLoading]="isSubmitting()">
              {{ 'auth.registerClient.submit' | translate }}
            </app-button>
          </div>
        </form>

        <app-social-buttons [label]="'auth.registerClient.socialLabel' | translate"></app-social-buttons>

        <p class="text-center text-sm text-text-muted mt-6">
          {{ 'auth.registerClient.alreadyAccount' | translate }}
          <a routerLink="/login" class="font-semibold text-accent-600 hover:text-accent-700">{{ 'auth.registerClient.login' | translate }}</a>
        </p>
      } @else {
        <app-otp-step
          [email]="email()"
          [error]="otpError()"
          (completed)="onOtpCompleted($event)"
          (back)="step.set('personal')"
        ></app-otp-step>
      }
    </app-auth-shell>
  `
})
export class RegisterClientComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  step = signal<Step>('personal');
  stepIndex = computed(() => this.step() === 'personal' ? 0 : 1);
  stepLabels = computed(() => [
    this.i18n.t('auth.registerClient.stepPersonal'),
    this.i18n.t('auth.registerClient.stepConfirm')
  ]);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  password = signal('');
  passwordConfirm = signal('');
  isSubmitting = signal(false);
  otpError = signal<string | null>(null);

  submit() {
    if (!this.firstName().trim() || !this.lastName().trim()) {
      this.toast.show('error', this.i18n.t('auth.registerClient.errName'));
      return;
    }
    if (!this.email().trim() || !this.email().includes('@')) {
      this.toast.show('error', this.i18n.t('auth.registerClient.errEmail'));
      return;
    }
    if (!this.phone().trim()) {
      this.toast.show('error', this.i18n.t('auth.registerClient.errPhone'));
      return;
    }
    if (this.password().length < 8) {
      this.toast.show('error', this.i18n.t('auth.registerClient.errPasswordLength'));
      return;
    }
    if (this.password() !== this.passwordConfirm()) {
      this.toast.show('error', this.i18n.t('auth.registerClient.errPasswordMatch'));
      return;
    }
    this.isSubmitting.set(true);
    const result = this.authService.requestRegisterOtp({
      firstName: this.firstName(), lastName: this.lastName(), email: this.email(), phone: this.phone(),
      password: this.password(), role: 'client'
    });
    this.isSubmitting.set(false);
    if (!result.ok) {
      this.toast.show('error', this.i18n.t(result.error!));
      return;
    }
    this.otpError.set(null);
    this.step.set('otp');
    this.toast.show('info', this.i18n.t('auth.registerClient.codeSentTo', { email: this.email() }));
  }

  onOtpCompleted(code: string) {
    const result = this.authService.verifyOtp(code);
    if (!result.ok) {
      this.otpError.set(this.i18n.t(result.error!));
      return;
    }
    this.toast.show('success', this.i18n.t('auth.registerClient.welcome', { name: result.user!.firstName }));
    this.router.navigateByUrl('/client');
  }
}
