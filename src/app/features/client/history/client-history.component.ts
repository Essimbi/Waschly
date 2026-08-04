import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DemandService } from '../services/demand.service';
import { DemandResponseDto } from '../models/demand.dto';
import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { StatusBadgeComponent } from '../../../shared/ui/display/status-badge/status-badge.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';

@Component({
  selector: 'app-client-history',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    StatusBadgeComponent,
    SkeletonComponent
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-4 p-4 pt-6 pb-24">
      <header>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Historie</h1>
        <p class="text-gray-500 text-sm mt-1">Alle Ihre bisherigen Wäschen auf einen Blick.</p>
      </header>

      @if (demandsQuery.isPending()) {
        <div class="space-y-4">
          <app-skeleton shape="rect" height="h-24" class="w-full rounded-2xl"></app-skeleton>
          <app-skeleton shape="rect" height="h-24" class="w-full rounded-2xl"></app-skeleton>
          <app-skeleton shape="rect" height="h-24" class="w-full rounded-2xl"></app-skeleton>
        </div>
      } @else {
        
        <div class="space-y-4">
          @for (demand of historyDemands(); track demand.id) {
            <div class="animate-fade-up stagger-item">
              <app-card [interactive]="true" [routerLink]="demand.status === 'completed' && !demand.reviewSubmitted ? ['/client/validate', demand.id] : ['/client/track', demand.id]" class="!p-0">
                <div class="flex items-center p-5">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-1">
                      <h3 class="font-bold text-gray-900 uppercase">{{ demand.vehicleType }} ({{ demand.washType }})</h3>
                      <app-status-badge [status]="demand.status"></app-status-badge>
                    </div>
                    <p class="text-sm text-gray-500">{{ demand.createdAt | date:'dd. MMMM yyyy, HH:mm' }}</p>
                  </div>
                  <div class="text-right flex flex-col items-end gap-2">
                    <!-- Action Required Indicator -->
                    <span *ngIf="demand.status === 'completed' && !demand.reviewSubmitted" class="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded-lg animate-pulse">
                      Bewertung ausstehend
                    </span>
                    <!-- Rating Display (Mocked logic for display since we just store boolean reviewSubmitted now) -->
                    <span *ngIf="demand.reviewSubmitted" class="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                      Bewertet
                    </span>
                  </div>
                </div>
              </app-card>
            </div>
          }

          @if (historyDemands().length === 0) {
            <div class="text-center py-16">
              <div class="w-16 h-16 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p class="text-gray-600 font-medium">Noch keine vergangenen Wäschen.</p>
            </div>
          }
        </div>

      }
    </div>
  `
})
export class ClientHistoryComponent {
  private demandService = inject(DemandService);

  demandsQuery = injectQuery(() => ({
    queryKey: ['demands', 'my'],
    queryFn: () => this.demandService.getMyDemands()
  }));

  historyDemands = computed(() => {
    const data = this.demandsQuery.data();
    if (!data) return [];
    return data.filter(d => ['completed', 'cancelled'].includes(d.status))
               .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });
}
