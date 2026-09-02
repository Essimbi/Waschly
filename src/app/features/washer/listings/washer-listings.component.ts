import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { BadgeComponent } from '../../../shared/ui/display/badge/badge.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/ui/feedback/empty-state/empty-state.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

import { DemandService } from '../../../core/data/demand.service';
import { DemandResponseDto } from '../../../core/data/demand.dto';

@Component({
  selector: 'app-washer-listings',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, SkeletonComponent, EmptyStateComponent, TranslatePipe],
  template: `
    <div class="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ 'washer.listings.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'washer.listings.subtitle' | translate }}</p>
      </header>

      @if (demandsQuery.isPending()) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-2xl p-6 shadow-soft-sm border border-gray-100">
              <app-skeleton shape="text" width="w-1/3" height="h-5"></app-skeleton>
              <app-skeleton shape="text" width="w-1/2" class="mt-3"></app-skeleton>
            </div>
          }
        </div>
      } @else if (demands().length === 0) {
        <app-empty-state
          [title]="'washer.listings.emptyTitle' | translate"
          [description]="'washer.listings.emptyDescription' | translate">
        </app-empty-state>
      } @else {
        <div class="space-y-4">
          @for (demand of demands(); track demand.id) {
            <app-card [interactive]="true" (click)="openDemand(demand.id)">
              <div header class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold text-gray-900">{{ vehicleLabel(demand) }} · {{ washLabel(demand) }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ demand.location.address }}</p>
                </div>
                <app-badge status="neutral">{{ distanceLabel(demand) }}</app-badge>
              </div>
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium capitalize">{{ dirtLabel(demand.dirtLevel) }}</span>
                <span class="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
                  {{ (demand.availability === 'asap' ? 'washer.availability.asap' : 'washer.availability.scheduled') | translate }}
                </span>
              </div>
            </app-card>
          }
        </div>
      }
    </div>
  `
})
export class WasherListingsComponent {
  private demandService = inject(DemandService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  demandsQuery = injectQuery(() => ({
    queryKey: ['demands', 'open'],
    queryFn: () => this.demandService.getOpenDemands(),
    refetchInterval: 15_000
  }));

  demands = () => this.demandsQuery.data() ?? [];

  vehicleLabel(d: DemandResponseDto) { return this.i18n.t(`washer.vehicleType.${d.vehicleType}`); }
  washLabel(d: DemandResponseDto) { return this.i18n.t(`washer.washType.${d.washType}`); }
  dirtLabel(level: string) {
    const key = level === 'light' ? 'light' : level === 'heavy' ? 'heavy' : 'medium';
    return this.i18n.t(`washer.dirtLevel.${key}`);
  }
  distanceLabel(d: DemandResponseDto) {
    return this.demandService.distanceToWasherKm(d.location).toFixed(1) + ' km';
  }

  openDemand(id: string) {
    this.router.navigate(['/washer/job', id]);
  }
}
