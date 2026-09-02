import { Component, inject, input, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

import { StatusPillComponent } from '../../../shared/ui/display/status-pill/status-pill.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { RatingComponent } from '../../../shared/ui/display/rating/rating.component';
import { BadgeComponent } from '../../../shared/ui/display/badge/badge.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { IconButtonComponent } from '../../../shared/ui/actions/icon-button/icon-button.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';

import { DemandService } from '../../../core/data/demand.service';
import { DemandStatus } from '../../../core/data/demand.dto';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-demand-tracking',
  standalone: true,
  imports: [
    CommonModule,
    StatusPillComponent,
    AvatarComponent,
    RatingComponent,
    BadgeComponent,
    ButtonComponent,
    IconButtonComponent,
    SkeletonComponent,
    TranslatePipe
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col pb-safe">
      <!-- Header -->
      <header class="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <app-icon-button [ariaLabel]="'client.demandTracking.goBackAria' | translate" variant="ghost" (click)="goBack()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </app-icon-button>
        <div class="flex-1">
          <h1 class="font-bold text-lg">{{ 'client.demandTracking.title' | translate }}</h1>
          @if (demand()) {
            <p class="text-xs text-gray-500 font-mono">{{ 'client.demandTracking.idLabel' | translate }} {{ demand()!.id }}</p>
          }
        </div>
        @if (demand()) {
          <app-status-pill [status]="demand()!.status"></app-status-pill>
        }
      </header>

      <main class="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
        <!-- Loading -->
        @if (demandQuery.isPending()) {
          <div class="space-y-4">
            <div class="bg-white rounded-xl p-6 shadow-sm border">
              <app-skeleton shape="text" width="w-1/2" height="h-6"></app-skeleton>
              <div class="flex items-center gap-4 mt-4">
                <app-skeleton shape="circle" width="w-14" height="h-14"></app-skeleton>
                <div class="flex-1 space-y-2">
                  <app-skeleton shape="text" width="w-1/2"></app-skeleton>
                  <app-skeleton shape="text" width="w-1/3"></app-skeleton>
                </div>
              </div>
            </div>
            <app-skeleton shape="rect" width="w-full" height="h-48"></app-skeleton>
          </div>
        }

        @else if (demand()) {
          <!-- Status Timeline -->
          <div class="bg-white rounded-xl p-4 shadow-sm border">
            <h2 class="font-semibold mb-4 text-gray-900">{{ 'client.demandTracking.statusHeading' | translate }}</h2>
            <div class="flex items-center gap-0">
              @for (step of statusSteps(); track step.key; let last = $last) {
                <div class="flex items-center flex-1 last:flex-initial">
                  <div class="flex flex-col items-center">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                      [class]="isStepDone(step.key) ? 'bg-green-500 text-white' : isStepCurrent(step.key) ? 'bg-accent-600 text-white ring-4 ring-accent-200' : 'bg-gray-200 text-gray-400'">
                      @if (isStepDone(step.key)) {
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                      } @else {
                        {{ $index + 1 }}
                      }
                    </div>
                    <span class="text-[10px] mt-1 text-gray-500 text-center leading-tight max-w-[60px]">{{ step.label }}</span>
                  </div>
                  @if (!last) {
                    <div class="h-0.5 flex-1 mx-1 transition-colors" [class]="isStepDone(step.key) ? 'bg-green-500' : 'bg-gray-200'"></div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Washer Card (if assigned) -->
          @if (demand()!.washer) {
            <div class="bg-white rounded-xl p-4 shadow-sm border">
              <h2 class="font-semibold mb-4 text-gray-900">{{ 'client.demandTracking.washerHeading' | translate }}</h2>
              <div class="flex items-center gap-4">
                <app-avatar
                  [src]="demand()!.washer!.avatarUrl ?? null"
                  [name]="demand()!.washer!.name"
                  size="xl">
                </app-avatar>
                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class="font-bold text-gray-900">{{ demand()!.washer!.name }}</p>
                    @if (demand()!.washer!.isVerified) {
                      <app-badge status="verified">{{ 'client.demandTracking.verifiedBadge' | translate }}</app-badge>
                    }
                  </div>
                  <app-rating [readonly]="true" [value]="demand()!.washer!.rating ?? 0" size="sm" class="mt-1"></app-rating>
                  <p class="text-sm text-gray-500 mt-0.5">{{ demand()!.washer!.rating?.toFixed(1) }} / 5</p>
                </div>
              </div>
              <!-- Messaging link -->
              <app-button variant="secondary" class="w-full mt-4" (click)="goToMessages()">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                {{ 'client.demandTracking.messageWasherButton' | translate }}
              </app-button>
            </div>
          }

          <!-- Map area / placeholder (shown once assigned) -->
          @if (demand()!.status === 'in_progress' || demand()!.status === 'assigned') {
            <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div class="h-48 bg-gray-200 flex items-center justify-center relative">
                <div class="absolute inset-0 bg-gray-100 animate-pulse"></div>
                <div class="relative z-10 text-center">
                  <div class="w-10 h-10 bg-accent-600 rounded-full mx-auto mb-2 flex items-center justify-center shadow-lg">
                    <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  </div>
                  <p class="text-sm text-gray-600 font-medium">{{ 'client.demandTracking.mapTitle' | translate }}</p>
                  <p class="text-xs text-gray-400">{{ 'client.demandTracking.mapPlaceholder' | translate }}</p>
                </div>
              </div>
              <div class="px-4 py-3 flex items-center gap-2 text-sm text-gray-600">
                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{{ 'client.demandTracking.washerOnWay' | translate }}</span>
              </div>
            </div>
          }

          <!-- Dev helper: change status for testing -->
          <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
            <p class="font-semibold text-amber-800 mb-2">{{ 'client.demandTracking.devHelperLabel' | translate }}</p>
            <div class="flex flex-wrap gap-2">
              @for (s of ['assigned', 'in_progress', 'completed']; track s) {
                <button 
                  class="px-3 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full text-xs font-mono transition-colors"
                  (click)="simulateStatus($any(s))">
                  → {{ s }}
                </button>
              }
            </div>
          </div>
        }
      </main>

      <!-- CTA Footer: the washer marks the wash as completed — the client confirms & rates here -->
      @if (demand()?.status === 'completed' && !demand()?.reviewSubmitted) {
        <footer class="fixed bottom-0 inset-x-0 bg-white border-t p-4">
          <app-button variant="primary" class="w-full" (click)="goToValidation()">
            {{ 'client.demandTracking.reviewButton' | translate }}
          </app-button>
        </footer>
      }
    </div>
  `
})
export class DemandTrackingComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private demandService = inject(DemandService);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);
  private i18n = inject(I18nService);

  demandId = signal('');

  statusSteps = computed(() => [
    { key: 'open' as DemandStatus, label: this.i18n.t('client.demandTracking.statusPublished') },
    { key: 'assigned' as DemandStatus, label: this.i18n.t('client.demandTracking.statusAssigned') },
    { key: 'in_progress' as DemandStatus, label: this.i18n.t('client.demandTracking.statusInProgress') },
    { key: 'completed' as DemandStatus, label: this.i18n.t('client.demandTracking.statusDone') }
  ]);

  private statusOrder: DemandStatus[] = ['open', 'assigned', 'in_progress', 'completed'];

  demandQuery = injectQuery(() => ({
    queryKey: ['demand', this.demandId()],
    queryFn: () => this.demandService.getDemandById(this.demandId()),
    enabled: !!this.demandId(),
    refetchInterval: 15_000 // Poll every 15s for real-time simulation
  }));

  demand = computed(() => this.demandQuery.data());

  // Dev only mutation
  devStatusMutation = injectMutation(() => ({
    mutationFn: (status: DemandStatus) => this.demandService.updateDemandStatus(this.demandId(), status),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['demand', this.demandId()] });
    }
  }));

  ngOnInit() {
    this.demandId.set(this.route.snapshot.paramMap.get('id') ?? '');
  }

  isStepDone(key: DemandStatus): boolean {
    const status = this.demand()?.status;
    if (!status) return false;
    return this.statusOrder.indexOf(status) > this.statusOrder.indexOf(key);
  }

  isStepCurrent(key: DemandStatus): boolean {
    return this.demand()?.status === key;
  }

  simulateStatus(status: DemandStatus) {
    this.devStatusMutation.mutate(status);
  }

  goToValidation() {
    this.router.navigate(['/client/validate', this.demandId()]);
  }

  goToMessages() {
    // TODO: route vers /messages/:demandId une fois le module messaging implémenté
    this.toast.show('info', this.i18n.t('client.demandTracking.toastMessagingSoon'));
  }

  goBack() {
    this.router.navigate(['/client']);
  }
}
