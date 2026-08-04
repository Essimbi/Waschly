import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * EmptyStateComponent
 * @description
 * Used when a list is empty or a search returns no results.
 * 
 * @example
 * <app-empty-state 
 *   title="No requests yet" 
 *   description="When you create a washing request, it will appear here."
 * >
 *   <app-button (click)="create()">Create Request</app-button>
 * </app-empty-state>
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 text-gray-400">
        <!-- Default Icon (can be overridden via projection or input, keeping it simple here) -->
        <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1">{{ title() }}</h3>
      <p class="text-sm text-gray-500 max-w-sm mb-6">{{ description() }}</p>
      
      <ng-content></ng-content>
    </div>
  `
})
export class EmptyStateComponent {
  title = input.required<string>();
  description = input.required<string>();
}
