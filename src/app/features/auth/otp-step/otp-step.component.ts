import { Component, input, output, signal, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from '../../../shared/ui/forms/otp-input/otp-input.component';
import { I18nService } from '../../../shared/i18n/i18n.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

const BACK_LOCK_SECONDS = 60;

@Component({
  selector: 'app-otp-step',
  standalone: true,
  imports: [CommonModule, OtpInputComponent, TranslatePipe],
  template: `
    <div class="text-center space-y-6 max-w-sm mx-auto">
      <div>
        <div class="w-14 h-14 rounded-2xl bg-accent-50 text-accent-600 flex items-center justify-center mx-auto mb-4">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9c1.657 0 3.183-.507 4.5-1.379"/></svg>
        </div>
        <h2 class="text-2xl font-bold text-text-main mb-2">{{ 'auth.otp.title' | translate }}</h2>
        <p class="text-text-muted">{{ subtitleParts().before }}<strong class="text-text-main">{{ email() }}</strong>{{ subtitleParts().after }}</p>
      </div>

      <app-otp-input [hasError]="!!error()" (completed)="onCompleted($event)"></app-otp-input>

      @if (error()) {
        <p class="text-red-600 text-sm font-medium" aria-live="polite">{{ error() }}</p>
      }

      @if (secondsLeft() > 0) {
        <p class="text-sm text-text-muted">
          {{ 'auth.otp.backIn' | translate }} <span class="font-mono font-semibold text-text-main">{{ formattedTime() }}</span>
        </p>
      } @else {
        <button type="button" (click)="back.emit()" class="text-sm font-semibold text-text-muted hover:text-accent-600 transition-colors">
          {{ 'auth.otp.back' | translate }}
        </button>
      }
    </div>
  `
})
export class OtpStepComponent implements OnInit, OnDestroy {
  private i18n = inject(I18nService);

  email = input.required<string>();
  error = input<string | null>(null);
  completed = output<string>();
  back = output<void>();

  subtitleParts(): { before: string; after: string } {
    const template = this.i18n.t('auth.otp.subtitle');
    const [before, after] = template.split('{email}');
    return { before, after: after ?? '' };
  }

  @ViewChild(OtpInputComponent) private otpInput?: OtpInputComponent;

  /** Blocks going back to the previous step (and resubmitting it) for a minute after the code is sent. */
  secondsLeft = signal(BACK_LOCK_SECONDS);
  private intervalId?: ReturnType<typeof setInterval>;

  formattedTime(): string {
    const s = this.secondsLeft();
    return `0:${s.toString().padStart(2, '0')}`;
  }

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.secondsLeft.update(s => {
        if (s <= 1) {
          clearInterval(this.intervalId);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  onCompleted(code: string) {
    this.completed.emit(code);
  }

  reset() {
    this.otpInput?.reset();
  }
}
