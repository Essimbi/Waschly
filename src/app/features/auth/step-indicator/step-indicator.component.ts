import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Horizontal numbered step indicator for multi-step auth forms
 * (register wizards). Steps before `current` show as done (checkmark),
 * the step at `current` is highlighted, the rest are upcoming.
 */
@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center mb-8">
      @for (label of steps(); track label; let i = $index; let last = $last) {
        <div class="flex items-center">
          <div class="flex flex-col items-center gap-1.5">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors duration-300" [ngClass]="circleClass(i)">
              @if (i < current()) {
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              } @else {
                {{ i + 1 }}
              }
            </div>
            <span class="text-[11px] font-semibold whitespace-nowrap" [ngClass]="i === current() ? 'text-text-main' : 'text-text-muted'">{{ label }}</span>
          </div>
          @if (!last) {
            <div class="w-8 sm:w-14 h-0.5 rounded-full mx-1.5 -mt-4 transition-colors duration-300" [ngClass]="lineClass(i)"></div>
          }
        </div>
      }
    </div>
  `
})
export class StepIndicatorComponent {
  steps = input.required<string[]>();
  /** 0-indexed position of the active step. */
  current = input.required<number>();
  variant = input<'accent' | 'aqua'>('accent');

  circleClass(i: number): string {
    const isAqua = this.variant() === 'aqua';
    if (i < this.current()) return isAqua ? 'bg-aqua-500 text-white' : 'bg-accent-500 text-white';
    if (i === this.current()) return isAqua ? 'bg-aqua-600 text-white ring-4 ring-aqua-100' : 'bg-accent-600 text-white ring-4 ring-accent-100';
    return 'bg-gray-100 text-gray-400';
  }

  lineClass(i: number): string {
    if (i >= this.current()) return 'bg-gray-200';
    return this.variant() === 'aqua' ? 'bg-aqua-500' : 'bg-accent-500';
  }
}
