import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/ui/feedback/empty-state/empty-state.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

import { DemandService } from '../../../core/data/demand.service';
import { DemandResponseDto } from '../../../core/data/demand.dto';

@Component({
  selector: 'app-washer-history',
  standalone: true,
  imports: [CommonModule, CardComponent, SkeletonComponent, EmptyStateComponent, TranslatePipe],
  template: `
    <div class="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ 'washer.history.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'washer.history.subtitle' | translate }}</p>
      </header>

      @if (jobsQuery.isPending()) {
        <app-skeleton shape="rect" width="w-full" height="h-32"></app-skeleton>
      } @else if (completedJobs().length === 0) {
        <app-empty-state
          [title]="'washer.history.emptyTitle' | translate"
          [description]="'washer.history.emptyDescription' | translate">
        </app-empty-state>
      } @else {
        <div class="space-y-4">
          @for (job of completedJobs(); track job.id) {
            <app-card>
              <div header class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold text-gray-900">{{ vehicleLabel(job) }} · {{ washLabel(job) }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ job.location.address }}</p>
                </div>
                @if (job.reviewSubmitted && job.clientRating) {
                  <span class="text-sm font-bold text-amber-600 whitespace-nowrap">{{ job.clientRating }} / 5 ★</span>
                } @else {
                  <span class="text-xs text-gray-400 whitespace-nowrap">{{ 'washer.history.noRatingYet' | translate }}</span>
                }
              </div>
              <p class="text-xs text-gray-400">{{ job.updatedAt | date:'d. MMM yyyy, HH:mm':undefined:dateLocale() }}</p>
            </app-card>
          }
        </div>
      }
    </div>
  `
})
export class WasherHistoryComponent {
  private demandService = inject(DemandService);
  private i18n = inject(I18nService);

  dateLocale = computed(() => this.i18n.currentLang() === 'de' ? 'de-DE' : 'en-US');

  jobsQuery = injectQuery(() => ({
    queryKey: ['washer', 'jobs', 'mine'],
    queryFn: () => this.demandService.getMyAssignedJobs()
  }));

  completedJobs = computed(() =>
    (this.jobsQuery.data() ?? []).filter((d: DemandResponseDto) => d.status === 'completed')
  );

  vehicleLabel(d: DemandResponseDto) { return this.i18n.t(`washer.vehicleType.${d.vehicleType}`); }
  washLabel(d: DemandResponseDto) { return this.i18n.t(`washer.washType.${d.washType}`); }
}
