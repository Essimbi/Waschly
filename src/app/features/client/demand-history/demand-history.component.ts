import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { StatusPillComponent } from '../../../shared/ui/display/status-pill/status-pill.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/ui/feedback/empty-state/empty-state.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { BadgeComponent } from '../../../shared/ui/display/badge/badge.component';

import { DemandService } from '../services/demand.service';
import { DemandResponseDto, WashType } from '../models/demand.dto';

@Component({
  selector: 'app-demand-history',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    StatusPillComponent,
    SkeletonComponent,
    EmptyStateComponent,
    ButtonComponent,
    BadgeComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white border-b px-4 py-4 sticky top-0 z-10">
        <h1 class="text-2xl font-bold text-gray-900">My Requests</h1>
      </header>

      <main class="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-24 md:pb-8">
        <!-- Loading -->
        @if (demandsQuery.isPending()) {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            @for (i of [1, 2, 3]; track i) {
              <div class="bg-white rounded-xl p-4 shadow-sm border space-y-3">
                <div class="flex justify-between items-center">
                  <app-skeleton shape="text" width="w-1/3"></app-skeleton>
                  <app-skeleton shape="rect" width="w-20" height="h-6"></app-skeleton>
                </div>
                <app-skeleton shape="text" width="w-2/3"></app-skeleton>
                <app-skeleton shape="text" width="w-1/2"></app-skeleton>
              </div>
            }
          </div>
        }

        <!-- Error -->
        @else if (demandsQuery.isError()) {
          <app-empty-state 
            title="Failed to load requests"
            description="Please check your connection and try again."
            iconSvg='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'>
            <app-button variant="secondary" (click)="demandsQuery.refetch()">Retry</app-button>
          </app-empty-state>
        }

        <!-- Empty -->
        @else if (demandsQuery.data()?.length === 0) {
          <app-empty-state 
            title="No requests yet"
            description="Publish your first wash request and get matched with a washer near you."
            iconSvg='<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>'>
            <app-button variant="primary" (click)="createNew()">Create Request</app-button>
          </app-empty-state>
        }

        <!-- List -->
        @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            @for (demand of demandsQuery.data(); track demand.id) {
              <app-card 
                variant="request" 
                (click)="openDemand(demand)"
                class="cursor-pointer h-full flex flex-col">
                <div header class="flex items-center justify-between">
                  <span class="font-semibold text-gray-900 text-sm">{{ washLabel(demand.washType) }}</span>
                  <app-status-pill [status]="demand.status"></app-status-pill>
                </div>
                
                <div class="py-2 space-y-2 flex-1">
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    <span>{{ demand.location.address || demand.location.lat + ', ' + demand.location.lng }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600">
                    <svg class="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>{{ demand.createdAt | date:'mediumDate' }}</span>
                  </div>
                </div>

                <div footer class="flex items-center justify-between mt-auto">
                  <div class="flex gap-2">
                    <app-badge [status]="'pending'">{{ demand.vehicleType | uppercase }}</app-badge>
                  </div>
                  @if (demand.status === 'completed') {
                    <app-button variant="ghost" size="sm" (click)="goToReview(demand.id, $event)">Leave Review</app-button>
                  } @else if (demand.status !== 'cancelled') {
                    <app-button variant="ghost" size="sm" (click)="openDemand(demand)">Track →</app-button>
                  }
                </div>
              </app-card>
            }
          </div>
        }
      </main>

      <!-- FAB for new request -->
      <div class="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-10">
        <button 
          (click)="createNew()"
          class="w-14 h-14 rounded-full bg-accent-600 text-white shadow-lg flex items-center justify-center hover:bg-accent-700 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent-300"
          aria-label="Create new request">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
        </button>
      </div>
    </div>
  `
})
export class DemandHistoryComponent {
  private router = inject(Router);
  private demandService = inject(DemandService);

  demandsQuery = injectQuery(() => ({
    queryKey: ['demands', 'my'],
    queryFn: () => this.demandService.getMyDemands(),
    staleTime: 30_000
  }));

  washLabel(type: WashType) {
    const labels: Record<WashType, string> = {
      exterior: 'Exterior Wash',
      interior: 'Interior Cleaning',
      full: 'Full Wash'
    };
    return labels[type] ?? type;
  }

  openDemand(demand: DemandResponseDto) {
    this.router.navigate(['/client/tracking', demand.id]);
  }

  goToReview(id: string, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/client/review', id]);
  }

  createNew() {
    this.router.navigate(['/client/new']);
  }
}
