import { Component, input } from '@angular/core';

/**
 * FabComponent
 * @description
 * Floating Action Button for mobile interfaces.
 * Positioned fixed at the bottom-right corner.
 * 
 * @example
 * <app-fab ariaLabel="Add new request" (click)="add()">
 *   <svg>...</svg>
 * </app-fab>
 */
@Component({
  selector: 'app-fab',
  standalone: true,
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      class="fixed bottom-20 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-accent-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-accent-700 hover:shadow-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-600 disabled:opacity-50 z-40"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class FabComponent {
  ariaLabel = input.required<string>();
  disabled = input<boolean>(false);
}
