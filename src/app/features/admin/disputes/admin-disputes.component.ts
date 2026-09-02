import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { BadgeComponent } from '../../../shared/ui/display/badge/badge.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../../shared/ui/feedback/empty-state/empty-state.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { DemandService } from '../../../core/data/demand.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-admin-disputes',
  standalone: true,
  imports: [CommonModule, CardComponent, BadgeComponent, ButtonComponent, SkeletonComponent, EmptyStateComponent, TranslatePipe],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'admin.disputes.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'admin.disputes.subtitle' | translate }}</p>
      </header>

      @if (disputesQuery.isPending()) {
        <app-skeleton shape="rect" width="w-full" height="h-32"></app-skeleton>
      } @else if (disputesQuery.data()?.length === 0) {
        <app-empty-state [title]="'admin.disputes.emptyTitle' | translate" [description]="'admin.disputes.emptyDescription' | translate"></app-empty-state>
      } @else {
        <div class="space-y-4">
          @for (dispute of disputesQuery.data(); track dispute.id) {
            <app-card>
              <div class="flex items-start justify-between gap-3 mb-2">
                <p class="font-mono text-xs text-gray-400">{{ i18n.t('admin.disputes.demandLabel', { id: dispute.demandId }) }}</p>
                <app-badge [status]="dispute.status === 'open' ? 'pending' : 'verified'">
                  {{ dispute.status === 'open' ? ('admin.disputes.statusOpen' | translate) : ('admin.disputes.statusResolved' | translate) }}
                </app-badge>
              </div>
              <p class="text-gray-900 font-medium mb-1">{{ dispute.reason }}</p>
              @if (dispute.status === 'resolved') {
                <p class="text-sm text-gray-500 mt-3 bg-gray-50 rounded-xl p-3">
                  <strong class="text-gray-700">{{ 'admin.disputes.resolutionLabel' | translate }}</strong> {{ dispute.resolutionNote }}
                </p>
              } @else {
                <div class="mt-4 flex gap-2">
                  <input
                    type="text"
                    [value]="noteDraft(dispute.id)"
                    (input)="setNote(dispute.id, $any($event.target).value)"
                    [placeholder]="'admin.disputes.notePlaceholder' | translate"
                    class="flex-1 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
                  />
                  <app-button variant="primary" size="sm" [isLoading]="resolveMutation.isPending()" (click)="resolve(dispute.id)">
                    {{ 'admin.disputes.markResolved' | translate }}
                  </app-button>
                </div>
              }
            </app-card>
          }
        </div>
      }
    </div>
  `
})
export class AdminDisputesComponent {
  private demandService = inject(DemandService);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);
  i18n = inject(I18nService);

  private notes = signal<Record<string, string>>({});

  disputesQuery = injectQuery(() => ({
    queryKey: ['admin', 'disputes'],
    queryFn: () => this.demandService.getDisputes()
  }));

  noteDraft(id: string) {
    return this.notes()[id] ?? '';
  }

  setNote(id: string, value: string) {
    this.notes.update(n => ({ ...n, [id]: value }));
  }

  resolveMutation = injectMutation(() => ({
    mutationFn: (vars: { id: string; note: string }) => this.demandService.resolveDispute(vars.id, vars.note),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['admin', 'disputes'] });
      this.toast.show('success', this.i18n.t('admin.disputes.resolveSuccess'));
    },
    onError: () => this.toast.show('error', this.i18n.t('admin.disputes.resolveError'))
  }));

  resolve(id: string) {
    const note = this.noteDraft(id).trim() || this.i18n.t('admin.disputes.defaultResolutionNote');
    this.resolveMutation.mutate({ id, note });
  }
}
