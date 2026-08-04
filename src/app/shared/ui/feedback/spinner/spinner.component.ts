import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SpinnerComponent
 * @description
 * An animated SVG spinner for loading states.
 * 
 * @example
 * <app-spinner size="lg" color="primary"></app-spinner>
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      class="animate-spin" 
      [ngClass]="classes()" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
      role="status"
      aria-label="Loading"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  `
})
export class SpinnerComponent {
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  color = input<'current' | 'primary' | 'white'>('primary');

  classes = computed(() => {
    let sizeClass = '';
    switch (this.size()) {
      case 'sm': sizeClass = 'w-4 h-4'; break;
      case 'md': sizeClass = 'w-6 h-6'; break;
      case 'lg': sizeClass = 'w-8 h-8'; break;
      case 'xl': sizeClass = 'w-12 h-12'; break;
    }

    let colorClass = '';
    switch (this.color()) {
      case 'primary': colorClass = 'text-primary-600'; break;
      case 'white': colorClass = 'text-white'; break;
      case 'current': colorClass = 'text-current'; break;
    }

    return `${sizeClass} ${colorClass}`;
  });
}
