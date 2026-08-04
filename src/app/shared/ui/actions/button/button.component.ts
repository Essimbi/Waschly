import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ButtonComponent
 * @description
 * A versatile button component supporting multiple variants and states.
 * 
 * @example
 * <app-button variant="primary" (click)="save()">Save</app-button>
 * <app-button variant="secondary" [isLoading]="true">Loading...</app-button>
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled() || isLoading()"
      [ngClass]="classes()"
      class="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <!-- Loading Spinner -->
      <svg *ngIf="isLoading()" class="absolute w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Content Projection (hidden visually when loading but keeps width) -->
      <span [class.invisible]="isLoading()" class="inline-flex items-center">
        <ng-content></ng-content>
      </span>
    </button>
  `
})
export class ButtonComponent {
  variant = input<'primary' | 'secondary' | 'danger' | 'ghost'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  type = input<'button' | 'submit' | 'reset'>('button');
  disabled = input<boolean>(false);
  isLoading = input<boolean>(false);

  classes = computed(() => {
    const baseVariant = this.variant();
    const baseSize = this.size();
    
    let variantClasses = '';
    switch (baseVariant) {
      case 'primary':
        variantClasses = 'bg-accent-600 text-white shadow-soft-sm hover:bg-accent-700 hover:shadow-soft-md focus-visible:ring-accent-500';
        break;
      case 'secondary':
        variantClasses = 'bg-white text-gray-700 shadow-soft-sm hover:shadow-soft-md hover:bg-accent-50 focus-visible:ring-accent-500';
        break;
      case 'danger':
        variantClasses = 'bg-red-50 text-red-700 hover:bg-red-100 focus-visible:ring-red-600';
        break;
      case 'ghost':
        variantClasses = 'bg-transparent text-gray-700 hover:bg-accent-50 hover:text-accent-700 focus-visible:ring-gray-500';
        break;
    }

    let sizeClasses = '';
    switch (baseSize) {
      case 'sm':
        sizeClasses = 'px-3 py-1.5 text-xs rounded-lg';
        break;
      case 'md':
        sizeClasses = 'px-4 py-2.5 text-sm rounded-xl';
        break;
      case 'lg':
        sizeClasses = 'px-6 py-3 text-base rounded-2xl';
        break;
    }

    // Active state micro-interaction (scale down slightly)
    return `${variantClasses} ${sizeClasses} transition-[box-shadow,background-color,transform] duration-200 ease-in-out active:scale-[0.98] font-semibold`;
  });
}
