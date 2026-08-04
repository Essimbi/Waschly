import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DemandStatus } from '../../../../features/client/models/demand.dto';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center px-2.5 py-1 rounded-xl text-xs font-semibold"
          [ngClass]="classes()">
      {{ label() }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<DemandStatus>();

  label = computed(() => {
    switch (this.status()) {
      case 'open': return 'Offen';
      case 'assigned': return 'Zugewiesen';
      case 'in_progress': return 'In Arbeit';
      case 'completed': return 'Abgeschlossen';
      case 'cancelled': return 'Storniert';
      default: return this.status();
    }
  });

  classes = computed(() => {
    switch (this.status()) {
      case 'open':
        return 'bg-yellow-50 text-yellow-800';
      case 'assigned':
        return 'bg-accent-50 text-accent-700';
      case 'in_progress':
        return 'bg-accent-100 text-accent-800';
      case 'completed':
        return 'bg-green-50 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  });
}
