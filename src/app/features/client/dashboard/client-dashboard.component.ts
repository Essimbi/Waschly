import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { DemandService } from '../../../core/data/demand.service';
import { DemandResponseDto } from '../../../core/data/demand.dto';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { StatusBadgeComponent } from '../../../shared/ui/display/status-badge/status-badge.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ButtonComponent,
    CardComponent,
    StatusBadgeComponent,
    SkeletonComponent,
    AvatarComponent,
    TranslatePipe
  ],
  template: `
    <div class="max-w-4xl mx-auto space-y-10 p-4 pt-6 pb-24">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ greeting() }}</h1>
          <p class="text-gray-500 text-sm mt-1">{{ 'client.dashboard.subtitle' | translate }}</p>
        </div>
        <app-button variant="primary" routerLink="/client/new" class="hidden sm:block">{{ 'client.dashboard.newWashButton' | translate }}</app-button>
      </header>

      @if (demandsQuery.isPending() || profileQuery.isPending()) {
        <div class="space-y-4">
          <app-skeleton shape="rect" height="h-32" class="w-full rounded-2xl"></app-skeleton>
          <app-skeleton shape="rect" height="h-32" class="w-full rounded-2xl"></app-skeleton>
        </div>
      } @else {

        <!-- Active Demands -->
        <section>
          <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ 'client.dashboard.activeSectionTitle' | translate }}</h2>
          
          @if (activeDemands().length > 0) {
            <div class="grid gap-4">
              @for (demand of activeDemands(); track demand.id) {
                <div class="animate-fade-up stagger-item">
                  <app-card [variant]="'request'" [interactive]="true" [routerLink]="['/client/track', demand.id]">
                    <div class="flex items-start justify-between">
                      <div>
                        <div class="flex items-center gap-2 mb-2">
                          <app-status-badge [status]="demand.status"></app-status-badge>
                          <span class="text-xs text-gray-500 font-medium">#{{ demand.id.substring(0,6) }}</span>
                        </div>
                        <h3 class="font-bold text-gray-900 uppercase">{{ demand.vehicleType }} ({{ demand.washType }})</h3>
                        <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {{ demand.location.address || ('client.dashboard.locationFallback' | translate) }}
                        </p>
                      </div>
                      <div class="text-right">
                        <p class="font-bold text-lg text-gray-900">35,00 €</p>
                      </div>
                    </div>
                    
                    @if (demand.washer) {
                      <div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                        <app-avatar [src]="demand.washer.avatarUrl || ''" [name]="demand.washer.name" size="sm"></app-avatar>
                        <div class="text-sm">
                          <p class="text-gray-500">{{ 'client.dashboard.yourWasher' | translate }}</p>
                          <p class="font-medium text-gray-900">{{ demand.washer.name }}</p>
                        </div>
                      </div>
                    }
                  </app-card>
                </div>
              }
            </div>
          } @else {
            <div class="bg-accent-50 rounded-3xl p-10 text-center">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft-sm text-accent-500">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2 tracking-tight">{{ 'client.dashboard.emptyTitle' | translate }}</h3>
              <p class="text-gray-600 mb-6">{{ 'client.dashboard.emptyText' | translate }}</p>
              <app-button variant="primary" routerLink="/client/new">{{ 'client.dashboard.emptyButton' | translate }}</app-button>
            </div>
          }
        </section>

        <!-- Recent History -->
        @if (recentHistory().length > 0) {
          <section class="mt-16">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-gray-800 tracking-tight">{{ 'client.dashboard.recentTitle' | translate }}</h2>
              <a routerLink="/client/history" class="text-sm font-medium text-accent-600 hover:text-accent-700">{{ 'client.dashboard.viewAll' | translate }}</a>
            </div>
            
            <div class="grid gap-3">
              @for (demand of recentHistory(); track demand.id) {
                <div class="animate-fade-up stagger-item">
                  <app-card [interactive]="true" [routerLink]="demand.status === 'completed' && !demand.reviewSubmitted ? ['/client/validate', demand.id] : ['/client/track', demand.id]" class="!p-4">
                    <div class="flex items-center justify-between">
                      <div>
                        <h3 class="font-semibold text-gray-900 uppercase">{{ demand.vehicleType }}</h3>
                        <p class="text-xs text-gray-500">{{ demand.createdAt | date:'dd.MM.yyyy HH:mm' }}</p>
                      </div>
                      <div class="flex items-center gap-3">
                        <app-status-badge [status]="demand.status"></app-status-badge>
                        <!-- Review Action Required Indicator -->
                        <span *ngIf="demand.status === 'completed' && !demand.reviewSubmitted" class="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-1 rounded-lg animate-pulse">{{ 'client.dashboard.reviewPending' | translate }}</span>
                      </div>
                    </div>
                  </app-card>
                </div>
              }
            </div>
          </section>
        }

      }
    </div>
  `
})
export class ClientDashboardComponent {
  private demandService = inject(DemandService);
  private i18n = inject(I18nService);

  greeting = computed(() =>
    this.i18n.t('client.dashboard.greeting', {
      name: this.profile()?.firstName || this.i18n.t('client.dashboard.guest')
    })
  );

  profileQuery = injectQuery(() => ({
    queryKey: ['profile'],
    queryFn: () => this.demandService.getClientProfile()
  }));

  demandsQuery = injectQuery(() => ({
    queryKey: ['demands', 'my'],
    queryFn: () => this.demandService.getMyDemands()
  }));

  profile = computed(() => this.profileQuery.data());

  activeDemands = computed(() => {
    const data = this.demandsQuery.data() as DemandResponseDto[];
    if (!data) return [];
    return data.filter(d => ['open', 'assigned', 'in_progress'].includes(d.status))
               .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  });

  recentHistory = computed(() => {
    const data = this.demandsQuery.data() as DemandResponseDto[];
    if (!data) return [];
    return data.filter(d => ['completed', 'cancelled'].includes(d.status))
               .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
               .slice(0, 3); // Show top 3 recent
  });
}
