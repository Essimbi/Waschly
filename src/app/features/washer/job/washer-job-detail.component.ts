import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { IconButtonComponent } from '../../../shared/ui/actions/icon-button/icon-button.component';
import { StatusPillComponent } from '../../../shared/ui/display/status-pill/status-pill.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

import { DemandService } from '../../../core/data/demand.service';
import { DemandResponseDto } from '../../../core/data/demand.dto';

@Component({
  selector: 'app-washer-job-detail',
  standalone: true,
  imports: [CommonModule, ButtonComponent, IconButtonComponent, StatusPillComponent, SkeletonComponent, TranslatePipe],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col pb-safe">
      <header class="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <app-icon-button [ariaLabel]="'washer.job.back' | translate" variant="ghost" (click)="goBack()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </app-icon-button>
        <h1 class="font-bold text-lg flex-1">{{ 'washer.job.title' | translate }}</h1>
        @if (demand()) {
          <app-status-pill [status]="demand()!.status"></app-status-pill>
        }
      </header>

      <main class="flex-1 p-4 space-y-6 max-w-2xl mx-auto w-full pb-32">
        @if (demandQuery.isPending()) {
          <div class="bg-white rounded-2xl p-6 shadow-soft-sm border border-gray-100 space-y-3">
            <app-skeleton shape="text" width="w-1/2" height="h-6"></app-skeleton>
            <app-skeleton shape="text" width="w-1/3"></app-skeleton>
          </div>
        } @else if (demand()) {
          <div class="bg-white rounded-2xl p-6 shadow-soft-sm border border-gray-100 space-y-4">
            <div>
              <p class="text-sm text-gray-500">{{ 'washer.job.vehicleAndWash' | translate }}</p>
              <p class="font-bold text-gray-900 text-lg">{{ vehicleLabel() }} · {{ washLabel() }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ 'washer.job.dirtLevel' | translate }}</p>
              <p class="font-medium text-gray-900 capitalize">{{ dirtLabel() }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ 'washer.job.location' | translate }}</p>
              <p class="font-medium text-gray-900">{{ demand()!.location.address }}</p>
              @if (demand()!.status === 'open') {
                <p class="text-xs text-gray-400 mt-0.5">{{ distanceAwayLabel() }}</p>
              }
            </div>
            <div>
              <p class="text-sm text-gray-500">{{ 'washer.job.availability' | translate }}</p>
              <p class="font-medium text-gray-900">
                {{ (demand()!.availability === 'asap' ? 'washer.availability.asap' : 'washer.availability.scheduled') | translate }}
              </p>
            </div>
            @if (demand()!.notes) {
              <div>
                <p class="text-sm text-gray-500">{{ 'washer.job.customerNote' | translate }}</p>
                <p class="font-medium text-gray-900">{{ demand()!.notes }}</p>
              </div>
            }
          </div>

          @if (demand()!.status === 'completed') {
            <div class="bg-white rounded-2xl p-6 shadow-soft-sm border border-gray-100">
              <p class="text-sm text-gray-500 mb-1">{{ 'washer.job.completed' | translate }}</p>
              @if (demand()!.reviewSubmitted && demand()!.clientRating) {
                <p class="font-medium text-gray-900">{{ ratingReceivedLabel() }}</p>
              } @else {
                <p class="text-gray-500 text-sm">{{ 'washer.job.notRatedYet' | translate }}</p>
              }
            </div>
          }

          @if (notMine()) {
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
              {{ 'washer.job.takenByAnother' | translate }}
            </div>
          }
        }
      </main>

      @if (demand() && !notMine()) {
        <footer class="fixed bottom-0 inset-x-0 bg-white border-t p-4">
          @switch (demand()!.status) {
            @case ('open') {
              <app-button variant="primary" class="w-full" [isLoading]="acceptMutation.isPending()" (click)="accept()">
                {{ 'washer.job.acceptButton' | translate }}
              </app-button>
            }
            @case ('assigned') {
              <app-button variant="primary" class="w-full" [isLoading]="statusMutation.isPending()" (click)="start()">
                {{ 'washer.job.startButton' | translate }}
              </app-button>
            }
            @case ('in_progress') {
              <app-button variant="primary" class="w-full" [isLoading]="statusMutation.isPending()" (click)="complete()">
                {{ 'washer.job.completeButton' | translate }}
              </app-button>
            }
          }
        </footer>
      }
    </div>
  `
})
export class WasherJobDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private demandService = inject(DemandService);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);
  private i18n = inject(I18nService);

  demandId = signal('');

  demandQuery = injectQuery(() => ({
    queryKey: ['demand', this.demandId()],
    queryFn: () => this.demandService.getDemandById(this.demandId()),
    enabled: !!this.demandId()
  }));

  washerProfileQuery = injectQuery(() => ({
    queryKey: ['washer', 'profile'],
    queryFn: () => this.demandService.getWasherProfile()
  }));

  demand = computed(() => this.demandQuery.data());

  notMine = computed(() => {
    const d = this.demand();
    const me = this.washerProfileQuery.data();
    if (!d || !me) return false;
    return d.status !== 'open' && d.washer?.id !== me.id;
  });

  ngOnInit() {
    this.demandId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  vehicleLabel() { return this.demand() ? this.i18n.t(`washer.vehicleType.${this.demand()!.vehicleType}`) : ''; }
  washLabel() { return this.demand() ? this.i18n.t(`washer.washType.${this.demand()!.washType}`) : ''; }
  dirtLabel() {
    const level = this.demand()?.dirtLevel;
    const key = level === 'light' ? 'light' : level === 'heavy' ? 'heavy' : 'medium';
    return this.i18n.t(`washer.dirtLevel.${key}`);
  }
  distanceLabel() {
    const d = this.demand();
    return d ? this.demandService.distanceToWasherKm(d.location).toFixed(1) + ' km' : '';
  }
  distanceAwayLabel() {
    return this.i18n.t('washer.job.distanceAway', { distance: this.distanceLabel() });
  }
  ratingReceivedLabel() {
    return this.i18n.t('washer.job.ratingReceived', { rating: this.demand()?.clientRating?.toString() ?? '' });
  }

  private invalidateAll() {
    this.queryClient.invalidateQueries({ queryKey: ['demand', this.demandId()] });
    this.queryClient.invalidateQueries({ queryKey: ['demands', 'open'] });
    this.queryClient.invalidateQueries({ queryKey: ['washer', 'jobs', 'mine'] });
  }

  acceptMutation = injectMutation(() => ({
    mutationFn: () => {
      const me = this.washerProfileQuery.data()!;
      return this.demandService.acceptDemand(this.demandId(), {
        id: me.id, name: `${me.firstName} ${me.lastName}`, avatarUrl: me.avatarUrl, rating: me.rating, isVerified: me.isVerified
      });
    },
    onSuccess: () => {
      this.invalidateAll();
      this.toast.show('success', this.i18n.t('washer.job.toastAccepted'));
    },
    onError: (err: Error) => {
      this.toast.show('error', err.message || this.i18n.t('washer.job.toastAcceptFailed'));
      this.invalidateAll();
    }
  }));

  statusMutation = injectMutation(() => ({
    mutationFn: (status: 'in_progress' | 'completed') => this.demandService.updateDemandStatus(this.demandId(), status),
    onSuccess: (_, status) => {
      this.invalidateAll();
      this.toast.show('success', status === 'in_progress' ? this.i18n.t('washer.job.toastStarted') : this.i18n.t('washer.job.toastCompleted'));
    },
    onError: () => this.toast.show('error', this.i18n.t('washer.job.toastUpdateFailed'))
  }));

  accept() { this.acceptMutation.mutate(); }
  start() { this.statusMutation.mutate('in_progress'); }
  complete() { this.statusMutation.mutate('completed'); }

  goBack() {
    this.router.navigate(['/washer']);
  }
}
