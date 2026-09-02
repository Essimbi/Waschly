import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/ui/display/badge/badge.component';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Role } from '../../../core/auth/user.model';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

type RoleFilter = Role | 'all';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, AvatarComponent, BadgeComponent, ButtonComponent, TranslatePipe],
  template: `
    <div class="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'admin.users.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'admin.users.subtitle' | translate }}</p>
      </header>

      <div class="flex gap-1.5">
        @for (opt of roleFilters; track opt.value) {
          <button type="button" (click)="filter.set(opt.value)"
            class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200"
            [ngClass]="filter() === opt.value ? 'bg-accent-600 border-accent-600 text-white' : 'bg-white border-gray-200 text-gray-600 hover:border-accent-300'">
            {{ opt.label | translate }}
          </button>
        }
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th class="text-left px-5 py-3 font-semibold">{{ 'admin.users.colUser' | translate }}</th>
                <th class="text-left px-5 py-3 font-semibold">{{ 'admin.users.colRole' | translate }}</th>
                <th class="text-left px-5 py-3 font-semibold">{{ 'admin.users.colStatus' | translate }}</th>
                <th class="text-right px-5 py-3 font-semibold">{{ 'admin.users.colAction' | translate }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (user of filteredUsers(); track user.id) {
                <tr class="hover:bg-gray-50/70 transition-colors">
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-3">
                      <app-avatar [src]="user.avatarUrl || ''" [name]="user.firstName" size="sm"></app-avatar>
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</p>
                        <p class="text-xs text-gray-500 truncate">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-5 py-3 capitalize text-gray-600">{{ roleLabel(user.role) }}</td>
                  <td class="px-5 py-3">
                    @if (!user.isActive) {
                      <app-badge status="suspended">{{ 'admin.users.statusSuspended' | translate }}</app-badge>
                    } @else if (user.role === 'washer') {
                      <app-badge [status]="user.verificationStatus === 'approved' ? 'verified' : user.verificationStatus === 'rejected' ? 'suspended' : 'pending'">
                        {{ user.verificationStatus === 'approved' ? ('admin.users.statusVerified' | translate) : user.verificationStatus === 'rejected' ? ('admin.users.statusRejected' | translate) : ('admin.users.statusPending' | translate) }}
                      </app-badge>
                    } @else {
                      <app-badge status="verified">{{ 'admin.users.statusActive' | translate }}</app-badge>
                    }
                  </td>
                  <td class="px-5 py-3 text-right">
                    @if (user.role !== 'admin') {
                      <app-button [variant]="user.isActive ? 'danger' : 'secondary'" size="sm" (click)="toggleActive(user.id, !user.isActive)">
                        {{ user.isActive ? ('admin.users.actionSuspend' | translate) : ('admin.users.actionReactivate' | translate) }}
                      </app-button>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private i18n = inject(I18nService);

  filter = signal<RoleFilter>('all');

  roleFilters: { value: RoleFilter; label: string }[] = [
    { value: 'all', label: 'admin.users.filterAll' },
    { value: 'client', label: 'admin.users.filterClients' },
    { value: 'washer', label: 'admin.users.filterWashers' },
    { value: 'admin', label: 'admin.users.filterAdmin' }
  ];

  filteredUsers = computed(() => {
    const f = this.filter();
    const users = this.authService.allUsers();
    return f === 'all' ? users : users.filter(u => u.role === f);
  });

  roleLabel(role: Role): string {
    return this.i18n.t('admin.users.role.' + role);
  }

  toggleActive(userId: string, active: boolean) {
    this.authService.setUserActive(userId, active);
    this.toast.show(active ? 'success' : 'info', active ? this.i18n.t('admin.users.toastReactivated') : this.i18n.t('admin.users.toastSuspended'));
  }
}
