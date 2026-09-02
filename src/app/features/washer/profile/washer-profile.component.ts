import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { injectQuery, injectMutation, QueryClient } from '@tanstack/angular-query-experimental';

import { DemandService } from '../../../core/data/demand.service';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { AvatarComponent } from '../../../shared/ui/display/avatar/avatar.component';
import { BadgeComponent } from '../../../shared/ui/display/badge/badge.component';
import { ToggleComponent } from '../../../shared/ui/forms/toggle/toggle.component';
import { SkeletonComponent } from '../../../shared/ui/feedback/skeleton/skeleton.component';
import { ToastService } from '../../../shared/ui/feedback/toast/toast.service';
import { WasherProfile } from '../../../core/data/demand.dto';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-washer-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, AvatarComponent, BadgeComponent, ToggleComponent, SkeletonComponent, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto space-y-8 p-4 pb-24">
      <header>
        <h1 class="text-2xl font-bold text-gray-900">{{ 'washer.profile.title' | translate }}</h1>
        <p class="text-gray-500 text-sm mt-1">{{ 'washer.profile.subtitle' | translate }}</p>
      </header>

      @if (profileQuery.isPending()) {
        <div class="bg-white rounded-2xl border p-6 space-y-4">
          <app-skeleton shape="circle" width="w-20" height="h-20"></app-skeleton>
          <app-skeleton shape="rect" width="w-full" height="h-12"></app-skeleton>
        </div>
      } @else if (profile()) {

        <!-- Stats & Availability -->
        <section class="bg-white rounded-2xl border shadow-sm p-6">
          <div class="flex items-center gap-6 mb-6">
            <app-avatar [src]="profile()!.avatarUrl || ''" [name]="profile()!.firstName" size="xl"></app-avatar>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h2 class="text-xl font-bold text-gray-900">{{ profile()!.firstName }} {{ profile()!.lastName }}</h2>
                @if (profile()!.isVerified) {
                  <app-badge status="verified">{{ 'washer.profile.verifiedBadge' | translate }}</app-badge>
                }
              </div>
              <p class="text-sm text-gray-500 mt-1">{{ washesCompletedLabel() }}</p>
            </div>
          </div>

          <div class="border-t pt-6">
            <app-toggle
              [label]="'washer.profile.availableToggleLabel' | translate"
              [description]="'washer.profile.availableToggleDescription' | translate"
              [checked]="profile()!.isAvailable"
              (checkedChange)="toggleAvailability($event)">
            </app-toggle>
          </div>
        </section>

        <!-- Profile Form -->
        <section class="bg-white rounded-2xl border shadow-sm p-6">
          <form [formGroup]="form" (ngSubmit)="save()" class="space-y-5">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'washer.profile.firstNameLabel' | translate }}</label>
                <input formControlName="firstName" type="text" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'washer.profile.lastNameLabel' | translate }}</label>
                <input formControlName="lastName" type="text" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'washer.profile.emailLabel' | translate }}</label>
              <input formControlName="email" type="email" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'washer.profile.phoneLabel' | translate }}</label>
              <input formControlName="phone" type="tel" class="w-full px-4 py-2.5 bg-gray-50 border-gray-200 border rounded-xl focus:bg-white focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all outline-none">
            </div>

            <div class="pt-4 flex justify-end">
              <app-button
                type="submit"
                variant="primary"
                [disabled]="form.invalid || !form.dirty"
                [isLoading]="updateMutation.isPending()">
                {{ 'washer.profile.saveButton' | translate }}
              </app-button>
            </div>
          </form>
        </section>
      }
    </div>
  `
})
export class WasherProfileComponent {
  private demandService = inject(DemandService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private queryClient = inject(QueryClient);
  private i18n = inject(I18nService);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  profileQuery = injectQuery(() => ({
    queryKey: ['washer', 'profile'],
    queryFn: () => this.demandService.getWasherProfile()
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

  washesCompletedLabel() {
    const p = this.profile();
    if (!p) return '';
    return this.i18n.t('washer.profile.ratingSummary', {
      rating: p.rating.toFixed(1),
      count: p.completedWashes.toString()
    });
  }

  updateMutation = injectMutation(() => ({
    mutationFn: (updates: Partial<WasherProfile>) => this.demandService.updateWasherProfile(updates),
    onSuccess: () => {
      this.toast.show('success', this.i18n.t('washer.profile.toastUpdated'));
      this.queryClient.invalidateQueries({ queryKey: ['washer', 'profile'] });
      this.form.markAsPristine();
    },
    onError: () => this.toast.show('error', this.i18n.t('washer.profile.toastUpdateFailed'))
  }));

  toggleAvailability(isAvailable: boolean) {
    this.updateMutation.mutate({ isAvailable });
  }

  save() {
    if (this.form.valid && this.form.dirty) {
      this.updateMutation.mutate(this.form.value as Partial<WasherProfile>);
    }
  }
}
