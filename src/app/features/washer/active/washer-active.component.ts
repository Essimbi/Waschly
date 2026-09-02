import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { StatusPillComponent } from '../../../shared/ui/display/status-pill/status-pill.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/ui/feedback/empty-state/empty-state.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

import { DemandService } from '../../../core/data/demand.service';
import { DemandResponseDto } from '../../../core/data/demand.dto';

@Component({
  selector: 'app-washer-active',
  standalone: true,
  imports: [CommonModule, CardComponent, StatusPillComponent, SkeletonComponent, EmptyStateComponent, ButtonComponent, TranslatePipe],
  template: `
    <div class="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">{{ 'washer.active.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'washer.active.subtitle' | translate }}</p>
      </header>

      @if (jobsQuery.isPending()) {
        <app-skeleton shape="rect" width="w-full" height="h-32"></app-skeleton>
      } @else if (activeJobs().length === 0) {
        <app-empty-state
          [title]="'washer.active.emptyTitle' | translate"
          [description]="'washer.active.emptyDescription' | translate">
          <app-button variant="primary" (click)="goToListings()">{{ 'washer.active.viewListingsButton' | translate }}</app-button>
        </app-empty-state>
      } @else {
        <div class="space-y-4">
          @for (job of activeJobs(); track job.id) {
            <app-card [interactive]="true" (click)="openJob(job.id)">
              <div header class="flex items-start justify-between gap-3">
                <div>
                  <p class="font-bold text-gray-900">{{ vehicleLabel(job) }} · {{ washLabel(job) }}</p>
                  <p class="text-sm text-gray-500 mt-0.5">{{ job.location.address }}</p>
                </div>
                <app-status-pill [status]="job.status"></app-status-pill>
              </div>
              <p class="text-sm text-gray-500">
                {{ (job.status === 'assigned' ? 'washer.active.readyToStart' : 'washer.active.inProgressHint') | translate }}
              </p>
            </app-card>
          }
        </div>
      }
    </div>
  `
})
export class WasherActiveComponent {
  private demandService = inject(DemandService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  jobsQuery = injectQuery(() => ({
    queryKey: ['washer', 'jobs', 'mine'],
    queryFn: () => this.demandService.getMyAssignedJobs()
  }));

  activeJobs = () => (this.jobsQuery.data() ?? []).filter(
    (d: DemandResponseDto) => d.status === 'assigned' || d.status === 'in_progress'
  );

  vehicleLabel(d: DemandResponseDto) { return this.i18n.t(`washer.vehicleType.${d.vehicleType}`); }
  washLabel(d: DemandResponseDto) { return this.i18n.t(`washer.washType.${d.washType}`); }

  openJob(id: string) {
    this.router.navigate(['/washer/job', id]);
  }

  goToListings() {
    this.router.navigate(['/washer']);
  }
}
