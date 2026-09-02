import { Component, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { DemandService } from '../../../core/data/demand.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonComponent, DatePipe, TranslatePipe],
  template: `
    <div class="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'admin.dashboard.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'admin.dashboard.subtitle' | translate }}</p>
      </header>

      @if (demandsQuery.isPending()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          @for (i of [1,2,3,4]; track i) {
            <app-skeleton shape="rect" width="w-full" height="h-24"></app-skeleton>
          }
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white rounded-2xl border border-gray-100 p-5">
            <p class="text-3xl font-extrabold text-accent-600">{{ activeUsers() }}</p>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{{ 'admin.dashboard.activeUsers' | translate }}</p>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 p-5">
            <p class="text-3xl font-extrabold text-accent-600">{{ totalDemands() }}</p>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{{ 'admin.dashboard.totalDemands' | translate }}</p>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 p-5">
            <p class="text-3xl font-extrabold text-accent-600">{{ completionRate() }}%</p>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{{ 'admin.dashboard.completionRate' | translate }}</p>
          </div>
          <div class="bg-white rounded-2xl border border-gray-100 p-5">
            <p class="text-3xl font-extrabold text-accent-600">{{ avgRating() }}</p>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-1">{{ 'admin.dashboard.avgRating' | translate }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 class="font-bold text-gray-900 mb-4">{{ 'admin.dashboard.demandsByStatus' | translate }}</h3>
            <div class="space-y-3">
              @for (row of statusBreakdown(); track row.status) {
                <div class="flex items-center gap-3">
                  <span class="text-sm text-gray-600 w-28 shrink-0 capitalize">{{ row.label }}</span>
                  <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-accent-500 rounded-full transition-all duration-500" [style.width.%]="row.pct"></div>
                  </div>
                  <span class="text-sm font-semibold text-gray-900 w-6 text-right">{{ row.count }}</span>
                </div>
              }
            </div>
          </div>

          <div class="bg-white rounded-2xl border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-gray-900">{{ 'admin.dashboard.pendingVerifications' | translate }}</h3>
              <a routerLink="/admin/verifications" class="text-xs font-semibold text-accent-600 hover:text-accent-700">{{ 'admin.dashboard.viewAll' | translate }}</a>
            </div>
            @if (pendingWashers().length === 0) {
              <p class="text-sm text-gray-500">{{ 'admin.dashboard.noPendingRequests' | translate }}</p>
            } @else {
              <ul class="space-y-2">
                @for (w of pendingWashers().slice(0, 4); track w.id) {
                  <li class="flex items-center justify-between text-sm">
                    <span class="text-gray-700">{{ w.firstName }} {{ w.lastName }}</span>
                    <span class="text-xs text-gray-400">{{ w.email }}</span>
                  </li>
                }
              </ul>
            }
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-6">
          <h3 class="font-bold text-gray-900 mb-4">{{ 'admin.dashboard.auditLog' | translate }}</h3>
          @if (auditLog().length === 0) {
            <p class="text-sm text-gray-500">{{ 'admin.dashboard.noAuditLog' | translate }}</p>
          } @else {
            <ul class="space-y-3">
              @for (entry of auditLog().slice(0, 8); track entry.id) {
                <li class="flex items-center justify-between text-sm border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                  <span class="text-gray-700"><strong class="font-semibold">{{ entry.actorName }}</strong> — {{ entry.action }} · {{ entry.targetLabel }}</span>
                  <span class="text-xs text-gray-400 shrink-0 ml-3">{{ entry.createdAt | date:'d. MMM, HH:mm':undefined:dateLocale() }}</span>
                </li>
              }
            </ul>
          }
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent {
  private demandService = inject(DemandService);
  private authService = inject(AuthService);
  private i18n = inject(I18nService);

  dateLocale = computed(() => this.i18n.currentLang() === 'de' ? 'de-DE' : 'en-US');

  demandsQuery = injectQuery(() => ({
    queryKey: ['admin', 'demands', 'all'],
    queryFn: () => this.demandService.getAllDemands()
  }));

  activeUsers = computed(() => this.authService.allUsers().filter(u => u.isActive).length);
  pendingWashers = computed(() => this.authService.pendingWashers());
  auditLog = computed(() => this.authService.auditLog());

  totalDemands = computed(() => this.demandsQuery.data()?.length ?? 0);

  completionRate = computed(() => {
    const demands = this.demandsQuery.data() ?? [];
    if (demands.length === 0) return 0;
    const completed = demands.filter(d => d.status === 'completed').length;
    return Math.round((completed / demands.length) * 100);
  });

  avgRating = computed(() => {
    const demands = this.demandsQuery.data() ?? [];
    const rated = demands.filter(d => d.clientRating);
    if (rated.length === 0) return '–';
    const avg = rated.reduce((sum, d) => sum + (d.clientRating ?? 0), 0) / rated.length;
    return avg.toFixed(1) + ' ★';
  });

  statusBreakdown = computed(() => {
    const demands = this.demandsQuery.data() ?? [];
    const total = demands.length || 1;
    const labels: Record<string, string> = {
      open: this.i18n.t('admin.dashboard.status.open'),
      assigned: this.i18n.t('admin.dashboard.status.assigned'),
      in_progress: this.i18n.t('admin.dashboard.status.inProgress'),
      completed: this.i18n.t('admin.dashboard.status.completed'),
      cancelled: this.i18n.t('admin.dashboard.status.cancelled')
    };
    return Object.entries(labels).map(([status, label]) => {
      const count = demands.filter(d => d.status === status).length;
      return { status, label, count, pct: Math.round((count / total) * 100) };
    });
  });
}
