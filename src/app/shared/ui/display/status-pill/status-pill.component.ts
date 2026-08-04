import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * StatusPillComponent
 * @description
 * Specific pill for washing request statuses.
 * 
 * @example
 * <app-status-pill status="open"></app-status-pill>
 */
@Component({
  selector: 'app-status-pill',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border"
      [ngClass]="classes()"
    >
      <!-- Dot indicator -->
      <svg class="mr-1.5 h-2 w-2" [ngClass]="dotClasses()" fill="currentColor" viewBox="0 0 8 8">
        <circle cx="4" cy="4" r="3" />
      </svg>
      {{ label() }}
    </div>
  `
})
export class StatusPillComponent {
  status = input.required<'open' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'>();

  label = computed(() => {
    switch (this.status()) {
      case 'open': return 'Open';
      case 'assigned': return 'Assigned';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
    }
  });

  classes = computed(() => {
    switch (this.status()) {
      case 'open': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'assigned': return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'in_progress': return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'completed': return 'bg-green-50 border-green-200 text-green-700';
      case 'cancelled': return 'bg-gray-100 border-gray-300 text-gray-500';
    }
  });

  dotClasses = computed(() => {
    switch (this.status()) {
      case 'open': return 'text-blue-500';
      case 'assigned': return 'text-purple-500';
      case 'in_progress': return 'text-yellow-500';
      case 'completed': return 'text-green-500';
      case 'cancelled': return 'text-gray-400';
    }
  });
}
