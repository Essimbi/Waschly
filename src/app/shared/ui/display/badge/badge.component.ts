import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * BadgeComponent
 * @description
 * A small colored badge for generic statuses.
 * 
 * @example
 * <app-badge status="verified">Verified</app-badge>
 */
@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="inline-flex items-center px-2.5 py-0.5 rounded-xl text-xs font-medium"
      [ngClass]="classes()"
    >
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {
  status = input<'pending' | 'verified' | 'suspended' | 'neutral'>('neutral');

  classes = computed(() => {
    switch (this.status()) {
      case 'verified':
        return 'bg-green-50 text-green-700 font-semibold';
      case 'suspended':
        return 'bg-red-50 text-red-700 font-semibold';
      case 'pending':
        return 'bg-amber-50 text-amber-700 font-semibold';
      case 'neutral':
      default:
        return 'bg-gray-100 text-gray-600 font-semibold';
    }
  });
}
