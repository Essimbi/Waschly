import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthShellComponent } from '../auth-shell/auth-shell.component';
import { OtpStepComponent } from '../otp-step/otp-step.component';
import { StepIndicatorComponent } from '../step-indicator/step-indicator.component';
import { SocialButtonsComponent } from '../social-buttons/social-buttons.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { FileUploaderComponent } from '../../../shared/ui/forms/file-uploader/file-uploader.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

type Step = 'personal' | 'documents' | 'otp';

@Component({
  selector: 'app-register-washer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AuthShellComponent, OtpStepComponent, StepIndicatorComponent, SocialButtonsComponent, ButtonComponent, FileUploaderComponent, TranslatePipe],
  template: `
    <app-auth-shell
      [title]="titleFor(step())"
      [subtitle]="subtitleFor(step())"
      [panelDescription]="'auth.registerWasher.panelDescription' | translate">

      <app-step-indicator [steps]="stepLabels()" [current]="stepIndex()" variant="aqua"></app-step-indicator>

      @if (step() === 'personal') {
        <form (ngSubmit)="goToDocuments()" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerWasher.firstName' | translate }}</label>
              <input type="text" [value]="firstName()" (input)="firstName.set($any($event.target).value)"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerWasher.lastName' | translate }}</label>
              <input type="text" [value]="lastName()" (input)="lastName.set($any($event.target).value)"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 transition-all outline-none" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerWasher.email' | translate }}</label>
            <input type="email" [value]="email()" (input)="email.set($any($event.target).value)" [placeholder]="'auth.registerWasher.emailPlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 transition-all outline-none" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerWasher.phone' | translate }}</label>
            <input type="tel" [value]="phone()" (input)="phone.set($any($event.target).value)" [placeholder]="'auth.registerWasher.phonePlaceholder' | translate"
              class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 transition-all outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerWasher.password' | translate }}</label>
              <input type="password" [value]="password()" (input)="password.set($any($event.target).value)" [placeholder]="'auth.registerWasher.passwordPlaceholder' | translate"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 transition-all outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'auth.registerWasher.passwordConfirm' | translate }}</label>
              <input type="password" [value]="passwordConfirm()" (input)="passwordConfirm.set($any($event.target).value)" [placeholder]="'auth.registerWasher.passwordPlaceholder' | translate"
                class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-aqua-500 focus:border-aqua-500 transition-all outline-none" />
            </div>
          </div>

          <div class="pt-3">
            <app-button type="submit" variant="primary" class="w-full !bg-aqua-600 hover:!bg-aqua-700">
              {{ 'auth.registerWasher.next' | translate }}
            </app-button>
          </div>
        </form>

        <app-social-buttons [label]="'auth.registerWasher.socialLabel' | translate"></app-social-buttons>

        <p class="text-center text-sm text-text-muted mt-6">
          {{ 'auth.registerWasher.alreadyAccount' | translate }}
          <a routerLink="/login" class="font-semibold text-aqua-600 hover:text-aqua-700">{{ 'auth.registerWasher.login' | translate }}</a>
        </p>
      }

      @if (step() === 'documents') {
        <form (ngSubmit)="submit()" class="space-y-5">
          <app-file-uploader
            [label]="'auth.registerWasher.documentLabel' | translate"
            [sensitive]="true"
            (fileSelected)="onDocument($event)">
          </app-file-uploader>

          <div class="pt-3 flex gap-3">
            <app-button type="button" variant="secondary" class="flex-1" (click)="step.set('personal')">
              {{ 'auth.registerWasher.back' | translate }}
            </app-button>
            <app-button type="submit" variant="primary" class="flex-[2] !bg-aqua-600 hover:!bg-aqua-700" [isLoading]="isSubmitting()">
              {{ 'auth.registerWasher.submit' | translate }}
            </app-button>
          </div>
        </form>
      }

      @if (step() === 'otp') {
        <app-otp-step
          [email]="email()"
          [error]="otpError()"
          (completed)="onOtpCompleted($event)"
          (back)="step.set('documents')"
        ></app-otp-step>
      }
    </app-auth-shell>
  `
})
export class RegisterWasherComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  step = signal<Step>('personal');
  stepIndex = computed(() => {
    switch (this.step()) {
      case 'personal': return 0;
      case 'documents': return 1;
      case 'otp': return 2;
    }
  });
  stepLabels = computed(() => [
    this.i18n.t('auth.registerWasher.stepPersonal'),
    this.i18n.t('auth.registerWasher.stepDocuments'),
    this.i18n.t('auth.registerWasher.stepConfirm')
  ]);

  firstName = signal('');
  lastName = signal('');
  email = signal('');
  phone = signal('');
  password = signal('');
  passwordConfirm = signal('');
  documentName = signal<string | null>(null);
  isSubmitting = signal(false);
  otpError = signal<string | null>(null);

  titleFor(step: Step): string {
    switch (step) {
      case 'personal': return this.i18n.t('auth.registerWasher.titlePersonal');
      case 'documents': return this.i18n.t('auth.registerWasher.titleDocuments');
      default: return '';
    }
  }

  subtitleFor(step: Step): string {
    switch (step) {
      case 'personal': return this.i18n.t('auth.registerWasher.subtitlePersonal');
      case 'documents': return this.i18n.t('auth.registerWasher.subtitleDocuments');
      default: return '';
    }
  }

  onDocument(file: File | null) {
    this.documentName.set(file?.name ?? null);
  }

  goToDocuments() {
    if (!this.firstName().trim() || !this.lastName().trim()) {
      this.toast.show('error', this.i18n.t('auth.registerWasher.errName'));
      return;
    }
    if (!this.email().trim() || !this.email().includes('@')) {
      this.toast.show('error', this.i18n.t('auth.registerWasher.errEmail'));
      return;
    }
    if (!this.phone().trim()) {
      this.toast.show('error', this.i18n.t('auth.registerWasher.errPhone'));
      return;
    }
    if (this.password().length < 8) {
      this.toast.show('error', this.i18n.t('auth.registerWasher.errPasswordLength'));
      return;
    }
    if (this.password() !== this.passwordConfirm()) {
      this.toast.show('error', this.i18n.t('auth.registerWasher.errPasswordMatch'));
      return;
    }
    this.step.set('documents');
  }

  submit() {
    if (!this.documentName()) {
      this.toast.show('error', this.i18n.t('auth.registerWasher.errDocument'));
      return;
    }
    this.isSubmitting.set(true);
    const result = this.authService.requestRegisterOtp({
      firstName: this.firstName(), lastName: this.lastName(), email: this.email(), phone: this.phone(),
      password: this.password(), role: 'washer', documentNames: [this.documentName()!]
    });
    this.isSubmitting.set(false);
    if (!result.ok) {
      this.toast.show('error', this.i18n.t(result.error!));
      return;
    }
    this.otpError.set(null);
    this.step.set('otp');
    this.toast.show('info', this.i18n.t('auth.registerWasher.codeSentTo', { email: this.email() }));
  }

  onOtpCompleted(code: string) {
    const result = this.authService.verifyOtp(code);
    if (!result.ok) {
      this.otpError.set(this.i18n.t(result.error!));
      return;
    }
    this.toast.show('success', this.i18n.t('auth.registerWasher.success', { name: result.user!.firstName }));
    this.router.navigateByUrl('/washer');
  }
}
