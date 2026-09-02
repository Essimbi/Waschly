import { Component, ElementRef, ViewChildren, QueryList, input, output, signal, inject, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../i18n/i18n.service';

/**
 * OtpInputComponent
 * @description
 * 6-digit one-time-passcode entry: one box per digit, auto-advance, paste support.
 *
 * @example
 * <app-otp-input (completed)="verify($event)"></app-otp-input>
 */
@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center gap-2 sm:gap-3" (paste)="onPaste($event)">
      @for (i of [0,1,2,3,4,5]; track i) {
        <input
          #box
          type="text"
          inputmode="numeric"
          maxlength="1"
          [attr.aria-label]="digitLabel(i)"
          [value]="digits()[i]"
          (input)="onInput($event, i)"
          (keydown)="onKeydown($event, i)"
          class="w-11 h-13 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-2xl border-2 bg-surface text-text-main transition-all duration-200 outline-none"
          [ngClass]="hasError() ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-surface-3 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20'"
        />
      }
    </div>
  `
})
export class OtpInputComponent implements AfterViewInit {
  private i18n = inject(I18nService);

  hasError = input<boolean>(false);
  completed = output<string>();

  @ViewChildren('box') boxes!: QueryList<ElementRef<HTMLInputElement>>;

  digits = signal<string[]>(['', '', '', '', '', '']);

  digitLabel(i: number): string {
    return this.i18n.t('shared.otpInput.digit', { n: String(i + 1) });
  }

  ngAfterViewInit() {
    this.boxes.first?.nativeElement.focus();
  }

  private emitIfComplete() {
    const code = this.digits().join('');
    if (code.length === 6) this.completed.emit(code);
  }

  onInput(event: Event, index: number) {
    const value = (event.target as HTMLInputElement).value.replace(/[^0-9]/g, '').slice(-1);
    this.digits.update(d => { const next = [...d]; next[index] = value; return next; });
    if (value && index < 5) {
      this.boxes.get(index + 1)?.nativeElement.focus();
    }
    this.emitIfComplete();
  }

  onKeydown(event: KeyboardEvent, index: number) {
    if (event.key === 'Backspace' && !this.digits()[index] && index > 0) {
      this.boxes.get(index - 1)?.nativeElement.focus();
    }
    if (event.key === 'ArrowLeft' && index > 0) {
      this.boxes.get(index - 1)?.nativeElement.focus();
    }
    if (event.key === 'ArrowRight' && index < 5) {
      this.boxes.get(index + 1)?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    const text = event.clipboardData?.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!text) return;
    event.preventDefault();
    const next = ['', '', '', '', '', ''];
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    this.digits.set(next);
    const focusIndex = Math.min(text.length, 5);
    this.boxes.get(focusIndex)?.nativeElement.focus();
    this.emitIfComplete();
  }

  reset() {
    this.digits.set(['', '', '', '', '', '']);
    this.boxes.first?.nativeElement.focus();
  }
}
