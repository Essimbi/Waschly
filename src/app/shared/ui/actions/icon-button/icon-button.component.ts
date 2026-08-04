import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * IconButtonComponent
 * @description
 * A 48x48px (min) accessible button meant exclusively for an icon, ensuring WCAG 2.1 AA tap target compliance.
 * 
 * @example
 * <app-icon-button ariaLabel="Close dialog" (click)="close()">
 *   <svg>...</svg>
 * </app-icon-button>
 */
@Component({
  selector: 'app-icon-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel()"
      [ngClass]="classes()"
      class="inline-flex items-center justify-center w-12 h-12 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class IconButtonComponent {
  ariaLabel = input.required<string>();
  variant = input<'primary' | 'secondary' | 'ghost'>('ghost');
  disabled = input<boolean>(false);

  classes = computed(() => {
    switch (this.variant()) {
      case 'primary':
        return 'bg-primary-900 text-white hover:bg-primary-800 focus-visible:ring-primary-900';
      case 'secondary':
        return 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus-visible:ring-primary-900';
      case 'ghost':
        return 'bg-transparent text-gray-600 hover:bg-gray-100 focus-visible:ring-gray-500';
      default:
        return '';
    }
  });
}
