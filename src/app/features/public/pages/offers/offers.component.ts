import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { ButtonComponent } from '../../../../shared/ui/actions/button/button.component';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../../shared/i18n/i18n.service';
import { DemandService } from '../../../../core/data/demand.service';
import { DemandResponseDto, VehicleType, WashType } from '../../../../core/data/demand.dto';
import { vehicleLabel, washLabel, neighborhood, relativeTime, vehicleImage } from '../../../../shared/utils/demand-display';

type VehicleFilter = VehicleType | 'all';
type WashFilter = WashType | 'all';
type AvailabilityFilter = 'asap' | 'scheduled' | 'all';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, ScrollRevealDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-10" appScrollReveal>
        <h1 class="font-display text-4xl font-semibold tracking-tight text-text-main sm:text-5xl">
          {{ 'offers.title' | translate }}
        </h1>
        <p class="mt-6 text-xl text-text-muted">
          {{ 'offers.subtitle' | translate }}
        </p>
      </div>

      <!-- Search & filters -->
      <div class="sticky top-16 z-20 bg-page/80 backdrop-blur-md py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8" appScrollReveal>
        <div class="glass rounded-2xl shadow-soft-sm p-4 space-y-4">
          <!-- Search -->
          <div class="relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
            </svg>
            <input
              type="text"
              [value]="search()"
              (input)="search.set($any($event.target).value)"
              [placeholder]="'offers.searchPlaceholder' | translate"
              class="w-full pl-12 pr-4 py-3 rounded-xl bg-surface border border-surface-3 focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20 outline-none transition-all text-text-main placeholder:text-text-muted"
            />
          </div>

          <!-- Filter pills -->
          <div class="flex flex-wrap gap-4">
            <div class="flex flex-wrap items-center gap-1.5">
              @for (opt of vehicleOptions(); track opt.value) {
                <button type="button" (click)="vehicleFilter.set(opt.value)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200"
                  [ngClass]="vehicleFilter() === opt.value ? 'bg-accent-600 border-accent-600 text-white' : 'bg-surface border-surface-3 text-text-muted hover:border-accent-300'">
                  {{ opt.label }}
                </button>
              }
            </div>
            <div class="w-px bg-surface-3 hidden sm:block"></div>
            <div class="flex flex-wrap items-center gap-1.5">
              @for (opt of washOptions(); track opt.value) {
                <button type="button" (click)="washFilter.set(opt.value)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200"
                  [ngClass]="washFilter() === opt.value ? 'bg-aqua-600 border-aqua-600 text-white' : 'bg-surface border-surface-3 text-text-muted hover:border-aqua-300'">
                  {{ opt.label }}
                </button>
              }
            </div>
            <div class="w-px bg-surface-3 hidden sm:block"></div>
            <div class="flex flex-wrap items-center gap-1.5">
              @for (opt of availabilityOptions(); track opt.value) {
                <button type="button" (click)="availabilityFilter.set(opt.value)"
                  class="px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors duration-200"
                  [ngClass]="availabilityFilter() === opt.value ? 'bg-text-main border-text-main text-white' : 'bg-surface border-surface-3 text-text-muted hover:border-gray-400'">
                  {{ opt.label }}
                </button>
              }
            </div>

            @if (hasActiveFilters()) {
              <button type="button" (click)="resetFilters()" class="ml-auto text-xs font-semibold text-accent-600 hover:text-accent-700 underline underline-offset-2">
                {{ 'offers.resetFilters' | translate }}
              </button>
            }
          </div>
        </div>
      </div>

      @if (offersQuery.isPending()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="rounded-3xl overflow-hidden bg-surface border border-surface-2 h-80 animate-pulse"></div>
          }
        </div>
      } @else if (filteredOffers().length === 0) {
        <div class="text-center bg-surface-2 rounded-3xl p-12 border border-surface-3">
          <h3 class="text-xl font-bold text-text-main mb-2">
            {{ (offers().length === 0 ? 'offers.empty_title' : 'offers.noResults_title') | translate }}
          </h3>
          <p class="text-text-muted mb-6">
            {{ (offers().length === 0 ? 'offers.empty_desc' : 'offers.noResults_desc') | translate }}
          </p>
          @if (hasActiveFilters()) {
            <app-button variant="secondary" (click)="resetFilters()">{{ 'offers.resetFilters' | translate }}</app-button>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (offer of filteredOffers(); track offer.id; let i = $index) {
            <div class="group relative rounded-3xl overflow-hidden bg-surface border border-surface-2 shadow-soft-sm hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1" [appScrollReveal]="{ delay: (i % 6) * 80 }">
              <div class="relative aspect-[4/3] overflow-hidden">
                <img [src]="carImage(offer)" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" [alt]="vehicleLabel(offer)"
                  onerror="this.src='https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=1200&auto=format&fit=crop'">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0"></div>
                <span class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-xs font-bold text-text-main shadow-sm">{{ timeLabel(offer) }}</span>
                <div class="absolute bottom-3 left-3 right-3 text-white">
                  <p class="font-bold flex items-center gap-1.5">
                    <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clip-rule="evenodd"/></svg>
                    {{ neighborhood(offer) }}
                  </p>
                </div>
              </div>
              <div class="p-5">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <p class="font-bold text-text-main">{{ vehicleLabel(offer) }} · {{ washLabel(offer) }}</p>
                </div>
                <p class="text-sm text-text-muted">
                  {{ offer.availability === 'asap' ? ('offers.asap' | translate) : ('offers.scheduled' | translate) }}
                </p>
              </div>
            </div>
          }
        </div>

        <!-- Washer conversion banner -->
        <div class="mt-16 bg-aqua-50 dark:bg-aqua-900/20 border border-aqua-200 dark:border-aqua-800/40 rounded-3xl p-8 text-center" appScrollReveal>
          <h3 class="font-display text-2xl font-semibold text-text-main mb-2">{{ 'offers.washerCta_title' | translate }}</h3>
          <p class="text-text-muted mb-6">{{ 'offers.washerCta_subtitle' | translate }}</p>
          <app-button variant="primary" size="lg" routerLink="/register/washer">
            {{ 'offers.washerCta_button' | translate }}
          </app-button>
        </div>
      }

      <div class="mt-8 text-center">
        <app-button variant="secondary" routerLink="/register/client">
          {{ 'offers.clientCta' | translate }}
        </app-button>
      </div>
    </div>
  `
})
export class OffersComponent {
  private demandService = inject(DemandService);
  private i18n = inject(I18nService);

  search = signal('');
  vehicleFilter = signal<VehicleFilter>('all');
  washFilter = signal<WashFilter>('all');
  availabilityFilter = signal<AvailabilityFilter>('all');

  private readonly vehicleTypes: VehicleType[] = ['compact', 'sedan', 'suv', 'van'];
  private readonly washTypes: WashType[] = ['exterior', 'interior', 'full'];

  vehicleOptions = computed<{ value: VehicleFilter; label: string }[]>(() => {
    const lang = this.i18n.currentLang();
    return [
      { value: 'all' as const, label: this.i18n.t('offers.filter_allVehicles') },
      ...this.vehicleTypes.map(v => ({ value: v as VehicleFilter, label: vehicleLabel(v, lang) }))
    ];
  });

  washOptions = computed<{ value: WashFilter; label: string }[]>(() => {
    const lang = this.i18n.currentLang();
    return [
      { value: 'all' as const, label: this.i18n.t('offers.filter_allWash') },
      ...this.washTypes.map(w => ({ value: w as WashFilter, label: washLabel(w, lang) }))
    ];
  });

  availabilityOptions = computed<{ value: AvailabilityFilter; label: string }[]>(() => [
    { value: 'all', label: this.i18n.t('offers.filter_allTime') },
    { value: 'asap', label: this.i18n.t('offers.asap') },
    { value: 'scheduled', label: this.i18n.t('offers.scheduled') },
  ]);

  hasActiveFilters = computed(() =>
    this.search().trim() !== '' || this.vehicleFilter() !== 'all' || this.washFilter() !== 'all' || this.availabilityFilter() !== 'all'
  );

  resetFilters() {
    this.search.set('');
    this.vehicleFilter.set('all');
    this.washFilter.set('all');
    this.availabilityFilter.set('all');
  }

  offersQuery = injectQuery(() => ({
    queryKey: ['demands', 'open'],
    queryFn: () => this.demandService.getOpenDemands(),
    refetchInterval: 20_000
  }));

  offers = computed(() => this.offersQuery.data() ?? []);

  filteredOffers = computed(() => {
    const query = this.search().trim().toLowerCase();
    const vehicle = this.vehicleFilter();
    const wash = this.washFilter();
    const availability = this.availabilityFilter();
    const lang = this.i18n.currentLang();

    return this.offers().filter(offer => {
      if (vehicle !== 'all' && offer.vehicleType !== vehicle) return false;
      if (wash !== 'all' && offer.washType !== wash) return false;
      if (availability !== 'all' && offer.availability !== availability) return false;
      if (query) {
        const haystack = [
          neighborhood(offer.location.address),
          vehicleLabel(offer.vehicleType, lang),
          washLabel(offer.washType, lang)
        ].join(' ').toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  });

  vehicleLabel(d: DemandResponseDto) { return vehicleLabel(d.vehicleType, this.i18n.currentLang()); }
  washLabel(d: DemandResponseDto) { return washLabel(d.washType, this.i18n.currentLang()); }
  neighborhood(d: DemandResponseDto) { return neighborhood(d.location.address); }
  timeLabel(d: DemandResponseDto) { return relativeTime(d.createdAt, this.i18n.currentLang()); }
  carImage(d: DemandResponseDto) { return vehicleImage(d.vehicleType); }
}
