import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

import { DemandService } from '../../../core/data/demand.service';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { ModalComponent } from '../../../shared/ui/layout/modal/modal.component';
import { UserProfile } from '../../../core/data/demand.dto';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-client-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    AvatarComponent,
    SkeletonComponent,
    ModalComponent,
    TranslatePipe
  ],
  template: `
    <div class="max-w-2xl mx-auto space-y-8 p-4 pb-24">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'client.profile.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'client.profile.subtitle' | translate }}</p>
      </header>

      @if (profileQuery.isPending()) {
        <div class="bg-white rounded-2xl border p-6 space-y-4">
          <div class="flex items-center gap-4">
            <app-skeleton shape="circle" width="w-20" height="h-20"></app-skeleton>
            <div class="space-y-2 flex-1">
              <app-skeleton shape="text" width="w-1/3" height="h-6"></app-skeleton>
              <app-skeleton shape="text" width="w-1/4"></app-skeleton>
            </div>
          </div>
          <div class="space-y-4 mt-8">
            <app-skeleton shape="rect" width="w-full" height="h-12"></app-skeleton>
            <app-skeleton shape="rect" width="w-full" height="h-12"></app-skeleton>
          </div>
        </div>
      } @else if (profile()) {
        
        <!-- Profile Form -->
        <section class="bg-white rounded-2xl border shadow-sm p-6">
          <div class="flex items-center gap-6 mb-8">
            <div class="relative group cursor-pointer">
              <app-avatar [src]="profile()!.avatarUrl || ''" [name]="profile()!.firstName" size="xl"></app-avatar>
              <div class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </div>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ profile()!.firstName }} {{ profile()!.lastName }}</h2>
              <p class="text-sm text-gray-500">{{ 'client.profile.memberSince' | translate }} {{ profile()!.memberSince | date:'MMMM yyyy':undefined:dateLocale() }}</p>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'client.profile.firstNameLabel' | translate }}</label>
                <input formControlName="firstName" type="text" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'client.profile.lastNameLabel' | translate }}</label>
                <input formControlName="lastName" type="text" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'client.profile.emailLabel' | translate }}</label>
              <input formControlName="email" type="email" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'client.profile.phoneLabel' | translate }}</label>
              <input formControlName="phone" type="tel" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
            </div>

            <div class="pt-4 flex justify-end">
              <app-button
                type="submit"
                variant="primary"
                [disabled]="form.invalid || !form.dirty"
                [isLoading]="updateMutation.isPending()">
                {{ 'client.profile.saveButton' | translate }}
              </app-button>
            </div>
          </form>
        </section>

        <!-- Danger Zone -->
        <section class="bg-red-50 rounded-2xl border border-red-100 p-6 mt-8">
          <h3 class="text-lg font-semibold text-red-900 mb-2">{{ 'client.profile.dangerZoneTitle' | translate }}</h3>
          <p class="text-sm text-red-700 mb-4">
            {{ 'client.profile.dangerZoneText' | translate }}
          </p>
          <app-button variant="danger" (click)="deleteModalOpen = true">
            {{ 'client.profile.deleteAccountButton' | translate }}
          </app-button>
        </section>

      }
    </div>

    <!-- Delete Confirmation Modal -->
    <app-modal [isOpen]="deleteModalOpen" (closed)="deleteModalOpen = false" [title]="'client.profile.deleteModalTitle' | translate">
      <p class="text-gray-600">
        {{ 'client.profile.deleteModalText' | translate }}
      </p>
      <div footer>
        <app-button variant="ghost" (click)="deleteModalOpen = false">{{ 'client.profile.cancelButton' | translate }}</app-button>
        <app-button variant="danger" (click)="deleteAccount()">{{ 'client.profile.confirmDeleteButton' | translate }}</app-button>
      </div>
    </app-modal>
  `
})
export class ClientProfileComponent {
  private demandService = inject(DemandService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);
  private i18n = inject(I18nService);

  dateLocale = computed(() => this.i18n.currentLang() === 'de' ? 'de-DE' : 'en-US');

  deleteModalOpen = false;

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  profileQuery = injectQuery(() => ({
    queryKey: ['profile'],
    queryFn: () => this.demandService.getClientProfile()
  }));

  profile = computed(() => {
    const data = this.profileQuery.data();
    if (data && !this.form.dirty) {
      this.form.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone
      }, { emitEvent: false });
    }
    return data;
  });

  updateMutation = injectMutation(() => ({
    mutationFn: (updates: Partial<UserProfile>) => this.demandService.updateClientProfile(updates),
    onSuccess: () => {
      this.toast.show('success', this.i18n.t('client.profile.toastUpdateSuccess'));
      this.queryClient.invalidateQueries({ queryKey: ['profile'] });
      this.form.markAsPristine();
    },
    onError: () => this.toast.show('error', this.i18n.t('client.profile.toastUpdateError'))
  }));

  save() {
    if (this.form.valid && this.form.dirty) {
      this.updateMutation.mutate(this.form.value as Partial<UserProfile>);
    }
  }

  deleteAccount() {
    this.deleteModalOpen = false;
    this.toast.show('info', this.i18n.t('client.profile.toastDeleteRequestSent'));
  }
}
