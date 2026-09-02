import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponent } from '../../../shared/ui/display/card/card.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { EmptyStateComponent } from '../../../shared/ui/feedback/empty-state/empty-state.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-admin-verifications',
  standalone: true,
  imports: [CommonModule, CardComponent, AvatarComponent, ButtonComponent, EmptyStateComponent, TranslatePipe],
  template: `
    <div class="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'admin.verifications.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'admin.verifications.subtitle' | translate }}</p>
      </header>

      @if (pending().length === 0) {
        <app-empty-state
          [title]="'admin.verifications.emptyTitle' | translate"
          [description]="'admin.verifications.emptyDescription' | translate">
        </app-empty-state>
      } @else {
        <div class="space-y-4">
          @for (user of pending(); track user.id) {
            <app-card>
              <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                <app-avatar [src]="user.avatarUrl || ''" [name]="user.firstName" size="lg"></app-avatar>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-gray-900">{{ user.firstName }} {{ user.lastName }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }} · {{ user.phone }}</p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ (user.documentNames?.length ?? 0) > 1 ? ('admin.verifications.documentsPlural' | translate) : ('admin.verifications.documentsSingular' | translate) }}
                    {{ user.documentNames?.join(', ') || ('admin.verifications.noDocuments' | translate) }}
                  </p>
                </div>
                <div class="flex gap-2 shrink-0">
                  <app-button variant="danger" [isLoading]="loadingId() === user.id" (click)="reject(user.id)">{{ 'admin.verifications.reject' | translate }}</app-button>
                  <app-button variant="primary" [isLoading]="loadingId() === user.id" (click)="approve(user.id)">{{ 'admin.verifications.approve' | translate }}</app-button>
                </div>
              </div>
            </app-card>
          }
        </div>
      }
    </div>
  `
})
export class AdminVerificationsComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  pending = computed(() => this.authService.pendingWashers());
  loadingId = signal<string | null>(null);

  approve(userId: string) {
    this.loadingId.set(userId);
    setTimeout(() => {
      this.authService.setVerificationStatus(userId, 'approved');
      this.toast.show('success', this.i18n.t('admin.verifications.approveSuccess'));
      this.loadingId.set(null);
    }, 400);
  }

  reject(userId: string) {
    this.loadingId.set(userId);
    setTimeout(() => {
      this.authService.setVerificationStatus(userId, 'rejected');
      this.toast.show('info', this.i18n.t('admin.verifications.rejectSuccess'));
      this.loadingId.set(null);
    }, 400);
  }
}
