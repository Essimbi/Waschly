import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ButtonComponent } from '../../shared/ui/actions/button/button.component';
import { RatingComponent } from '../../shared/ui/display/rating/rating.component';
import { AvatarComponent } from '../../shared/ui/display/avatar/avatar.component';
import { ScrollRevealDirective } from '../../shared/ui/animations/scroll-reveal.directive';
import { Tilt3DDirective } from '../../shared/ui/animations/tilt-3d.directive';
import { TranslatePipe } from '../../shared/i18n/translate.pipe';
import { I18nService } from '../../shared/i18n/i18n.service';
import { DemandService } from '../../core/data/demand.service';
import { DemandResponseDto, TopWasher } from '../../core/data/demand.dto';
import { vehicleLabel, washLabel, neighborhood, relativeTime, vehicleImage } from '../../shared/utils/demand-display';

type Audience = 'client' | 'washer';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, RatingComponent, AvatarComponent, ScrollRevealDirective, Tilt3DDirective, TranslatePipe],
  template: `
    <div class="flex flex-col font-sans relative z-10">

      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-20">
        <div class="aurora-bg"><span></span><span></span></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div class="space-y-8 text-center lg:text-left" appScrollReveal>
            <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-text-main tracking-tight leading-tight">
              {{ 'hero.title1' | translate }} <br/> <span class="text-accent-500">{{ 'hero.title2' | translate }}</span> <br/> {{ 'hero.title3' | translate }}
            </h1>
            <p class="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto lg:mx-0 font-light">
              {{ 'hero.subtitle' | translate }}
            </p>

            <!-- Dual-intent CTAs -->
            <div class="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2">
              <app-button variant="primary" routerLink="/register/client" class="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl shadow-soft-md hover:shadow-soft-lg transform hover:-translate-y-1 transition-all duration-300">
                {{ 'hero.cta' | translate }}
              </app-button>
              <app-button variant="secondary" routerLink="/register/washer" class="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl border-2 border-aqua-200 text-aqua-700 hover:bg-aqua-50">
                {{ 'hero.ctaSecondary' | translate }}
              </app-button>
            </div>

            <!-- Trust micro-badges -->
            <div class="flex flex-wrap items-center gap-x-6 gap-y-3 justify-center lg:justify-start pt-2 text-sm text-text-muted">
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-4 h-4 text-aqua-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd"/></svg>
                {{ 'hero.trust1' | translate }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-4 h-4 text-aqua-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.618a1.5 1.5 0 01-1.6 0C7.04 20.4 4 16.556 4 12V6.5a1.5 1.5 0 01.9-1.373l6.75-2.917a1.5 1.5 0 011.2 0l6.75 2.917a1.5 1.5 0 01.9 1.373V12z"/></svg>
                {{ 'hero.trust2' | translate }}
              </span>
              <span class="inline-flex items-center gap-1.5">
                <svg class="w-4 h-4 text-aqua-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ 'hero.trust3' | translate }}
              </span>
            </div>

            <!-- Compact stat chips -->
            <div class="flex flex-wrap items-baseline gap-x-8 gap-y-2 justify-center lg:justify-start pt-4 border-t border-surface-3">
              <div class="pt-4"><span class="text-2xl font-display font-semibold text-text-main">{{ 'stats.washers' | translate }}</span> <span class="text-sm text-text-muted">{{ 'stats.label_washers' | translate }}</span></div>
              <div class="pt-4"><span class="text-2xl font-display font-semibold text-text-main">{{ 'stats.cities' | translate }}</span> <span class="text-sm text-text-muted">{{ 'stats.label_cities' | translate }}</span></div>
              <div class="pt-4"><span class="text-2xl font-display font-semibold text-text-main">{{ 'stats.rating' | translate }}</span> <span class="text-sm text-text-muted">{{ 'stats.label_rating' | translate }}</span></div>
            </div>
          </div>

          <!-- Hero Illustration -->
          <div class="relative max-w-xl mx-auto lg:ml-auto w-full group perspective-1000" appScrollReveal="{ delay: 200, direction: 'right' }" appTilt3D>
            <div class="absolute -inset-1 bg-gradient-to-r from-accent-400 to-aqua-300 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div class="relative aspect-[4/3] glass rounded-[2rem] shadow-soft-xl overflow-hidden flex items-center justify-center p-2">
              <img src="/landing_hero_illustration_1785839172943.jpg" class="w-full h-full object-cover rounded-3xl" alt="Washer cleaning a Tesla" onerror="this.src='https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2000&auto=format&fit=crop'">
            </div>
          </div>
        </div>
      </section>

      <!-- Offers Showcase (signature section) -->
      <section class="py-24 bg-surface-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12" appScrollReveal>
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-2 mb-4">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-aqua-500"></span>
                </span>
                <span class="text-xs font-bold uppercase tracking-widest text-aqua-700">{{ 'recentOffers.eyebrow' | translate }}</span>
              </div>
              <h2 class="font-display text-4xl md:text-5xl font-semibold text-text-main tracking-tight">{{ 'recentOffers.title' | translate }}</h2>
              <p class="mt-4 text-xl text-text-muted">{{ 'recentOffers.subtitle' | translate }}</p>
            </div>
            @if (offers().length > 0) {
              <p class="text-sm font-semibold text-text-muted shrink-0">
                {{ offers().length }} {{ 'recentOffers.openLabel' | translate }}
              </p>
            }
          </div>

          @if (offersQuery.isPending()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (i of [1,2,3]; track i) {
                <div class="rounded-3xl overflow-hidden bg-surface border border-surface-3 h-80 animate-pulse"></div>
              }
            </div>
          } @else if (offers().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (offer of offers(); track offer.id; let i = $index) {
                <div class="group relative rounded-3xl overflow-hidden bg-surface border border-surface-3 shadow-soft-sm hover:shadow-soft-lg transition-all duration-500 hover:-translate-y-1" [appScrollReveal]="{ delay: i * 100 }">
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
                    <p class="font-bold text-text-main">{{ vehicleLabel(offer) }} · {{ washLabel(offer) }}</p>
                    <p class="text-sm text-text-muted mt-1">
                      {{ offer.availability === 'asap' ? ('offers.asap' | translate) : ('offers.scheduled' | translate) }}
                    </p>
                  </div>
                </div>
              }
            </div>
          }

          <div class="text-center mt-12" appScrollReveal>
            <app-button variant="secondary" routerLink="/offers" size="lg">
              {{ 'recentOffers.cta' | translate }}
            </app-button>
          </div>
        </div>
      </section>

      <!-- How it works: two paths -->
      <section class="py-24 bg-surface">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-12" appScrollReveal>
            <h2 class="font-display text-4xl md:text-5xl font-semibold text-text-main mb-6 tracking-tight">{{ 'howItWorks.title' | translate }}</h2>
            <p class="text-xl text-text-muted">{{ 'howItWorks.subtitle' | translate }}</p>
          </div>

          <!-- Audience toggle -->
          <div class="flex justify-center mb-16" appScrollReveal>
            <div class="inline-flex bg-surface-2 p-1.5 rounded-2xl border border-surface-3">
              <button type="button" (click)="audience.set('client')"
                class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                [ngClass]="audience() === 'client' ? 'bg-accent-600 text-white shadow-soft-sm' : 'text-text-muted hover:text-text-main'">
                {{ 'howItWorks.tab_client' | translate }}
              </button>
              <button type="button" (click)="audience.set('washer')"
                class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                [ngClass]="audience() === 'washer' ? 'bg-accent-600 text-white shadow-soft-sm' : 'text-text-muted hover:text-text-main'">
                {{ 'howItWorks.tab_washer' | translate }}
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (step of currentSteps(); track step.titleKey; let i = $index) {
              <div class="relative bg-surface-2 p-8 rounded-3xl shadow-soft-sm hover:shadow-soft-md hover:-translate-y-2 transition-all duration-300 border border-surface-3 text-center flex flex-col items-center" [appScrollReveal]="{ delay: i * 100 }" appTilt3D>
                <div class="w-14 h-14 bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                  <div [innerHTML]="safeIcon(step.icon)" class="w-7 h-7"></div>
                </div>
                <div class="absolute -top-4 -right-4 w-10 h-10 bg-accent-600 text-white font-bold rounded-full flex items-center justify-center shadow-soft-sm">{{ i + 1 }}</div>
                <h3 class="text-xl font-bold text-text-main mb-3">{{ step.titleKey | translate }}</h3>
                <p class="text-text-muted">{{ step.descKey | translate }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Trust & Guarantee band -->
      <section class="py-24 bg-accent-900 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-accent-800/60 to-transparent pointer-events-none"></div>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-2xl mx-auto mb-16" appScrollReveal>
            <span class="text-xs font-bold uppercase tracking-widest text-aqua-400">{{ 'trust.eyebrow' | translate }}</span>
            <h2 class="font-display text-4xl md:text-5xl font-semibold text-white mt-4 tracking-tight">{{ 'trust.title' | translate }}</h2>
            <p class="mt-4 text-xl text-accent-100">{{ 'trust.subtitle' | translate }}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            @for (seal of trustFeatures; track seal.titleKey; let i = $index) {
              <div class="text-center" [appScrollReveal]="{ delay: i * 100 }">
                <div class="w-20 h-20 mx-auto mb-5 rounded-full bg-white/10 border-2 border-aqua-400/40 flex items-center justify-center backdrop-blur-sm">
                  <div [innerHTML]="safeIcon(seal.icon)" class="w-9 h-9 text-aqua-300"></div>
                </div>
                <h3 class="font-bold text-lg text-white mb-2">{{ seal.titleKey | translate }}</h3>
                <p class="text-accent-200 text-sm leading-relaxed">{{ seal.descKey | translate }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Top-rated Washers -->
      <section class="py-24 bg-surface-2">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-2xl mx-auto mb-16" appScrollReveal>
            <span class="text-xs font-bold uppercase tracking-widest text-accent-600">{{ 'topWashers.eyebrow' | translate }}</span>
            <h2 class="font-display text-4xl md:text-5xl font-semibold text-text-main mt-4 tracking-tight">{{ 'topWashers.title' | translate }}</h2>
            <p class="mt-4 text-xl text-text-muted">{{ 'topWashers.subtitle' | translate }}</p>
          </div>

          @if (topWashers().length > 0) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (washer of topWashers(); track washer.id; let i = $index) {
                <div class="bg-surface rounded-3xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all duration-300 border border-surface-3 flex items-center gap-4" [appScrollReveal]="{ delay: i * 80 }">
                  <div class="relative shrink-0">
                    <img [src]="washer.avatarUrl" [alt]="washer.name" class="w-16 h-16 rounded-2xl object-cover shadow-sm">
                    @if (washer.isVerified) {
                      <span class="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-aqua-500 rounded-full flex items-center justify-center border-2 border-surface shadow-sm">
                        <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                      </span>
                    }
                  </div>
                  <div class="min-w-0">
                    <p class="font-bold text-text-main truncate">{{ washer.name }}</p>
                    <p class="text-sm text-text-muted mb-1">{{ washer.city }}</p>
                    <div class="flex items-center gap-2">
                      <app-rating [value]="washer.rating" [readonly]="true" size="sm"></app-rating>
                      <span class="text-xs text-text-muted">{{ washer.completedWashes }} {{ 'topWashers.completedLabel' | translate }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-24 bg-surface">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="font-display text-4xl md:text-5xl font-semibold mb-16 text-center tracking-tight text-text-main" appScrollReveal>{{ 'testimonials.title' | translate }}</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (review of reviews; track review.nameKey; let i = $index) {
              <div class="bg-surface-2 p-8 rounded-3xl shadow-soft-sm hover:shadow-soft-md transition-all duration-300 border border-surface-3 hover:-translate-y-1" [appScrollReveal]="{ delay: i * 150 }">
                <app-rating [value]="review.rating" [readonly]="true" size="sm" class="mb-8 block"></app-rating>
                <p class="text-text-muted mb-8 italic text-lg leading-relaxed">"{{ review.textKey | translate }}"</p>
                <div class="flex items-center gap-4">
                  <app-avatar [src]="review.avatar" [name]="review.nameKey | translate" size="lg" class="ring-2 ring-surface-3 rounded-full"></app-avatar>
                  <div>
                    <p class="text-text-main font-bold">{{ review.nameKey | translate }}</p>
                    <p class="text-sm text-text-muted">{{ 'testimonials.verified' | translate }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Final CTA: choose your path -->
      <section class="py-24 bg-page relative overflow-hidden">
        <div class="aurora-bg"><span></span><span></span></div>
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="text-center max-w-2xl mx-auto mb-16" appScrollReveal>
            <span class="text-xs font-bold uppercase tracking-widest text-accent-600">{{ 'finalCta.eyebrow' | translate }}</span>
            <h2 class="font-display text-4xl md:text-5xl font-semibold text-text-main mt-4 tracking-tight">{{ 'finalCta.title' | translate }}</h2>
            <p class="mt-4 text-xl text-text-muted">{{ 'finalCta.subtitle' | translate }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Client path -->
            <div class="group relative rounded-[2.5rem] p-10 bg-accent-600 overflow-hidden shadow-soft-xl hover:-translate-y-1.5 transition-transform duration-500" appScrollReveal appTilt3D>
              <div class="absolute inset-0 pattern-dots text-white/10 pointer-events-none"></div>
              <div class="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
              <div class="relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                </div>
                <h3 class="font-display text-2xl font-semibold text-white mb-3">{{ 'finalCta.client_title' | translate }}</h3>
                <p class="text-accent-50 mb-8 leading-relaxed">{{ 'finalCta.client_desc' | translate }}</p>
                <app-button variant="secondary" size="lg" routerLink="/register/client" class="!text-accent-700 font-bold w-full sm:w-auto">
                  {{ 'finalCta.client_button' | translate }}
                </app-button>
              </div>
            </div>

            <!-- Washer path -->
            <div class="group relative rounded-[2.5rem] p-10 bg-aqua-600 overflow-hidden shadow-soft-xl hover:-translate-y-1.5 transition-transform duration-500" [appScrollReveal]="{ delay: 120 }" appTilt3D>
              <div class="absolute inset-0 pattern-dots text-white/10 pointer-events-none"></div>
              <div class="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
              <div class="relative z-10">
                <div class="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m-4 6h16a1 1 0 011 1v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a1 1 0 011-1z"/></svg>
                </div>
                <h3 class="font-display text-2xl font-semibold text-white mb-3">{{ 'finalCta.washer_title' | translate }}</h3>
                <p class="text-aqua-50 mb-8 leading-relaxed">{{ 'finalCta.washer_desc' | translate }}</p>
                <app-button variant="secondary" size="lg" routerLink="/register/washer" class="!text-aqua-700 font-bold w-full sm:w-auto">
                  {{ 'finalCta.washer_button' | translate }}
                </app-button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `
})
export class LandingComponent {
  private demandService = inject(DemandService);
  private i18n = inject(I18nService);
  private sanitizer = inject(DomSanitizer);

  currentYear = new Date().getFullYear();

  /** Icon strings below are hardcoded, developer-authored SVGs — safe to bypass sanitization.
   *  Without this, Angular's default HTML sanitizer strips <svg> entirely from [innerHTML]. */
  private safeIconCache = new Map<string, SafeHtml>();
  safeIcon(svg: string): SafeHtml {
    let safe = this.safeIconCache.get(svg);
    if (!safe) {
      safe = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.safeIconCache.set(svg, safe);
    }
    return safe;
  }
  audience = signal<Audience>('client');

  offersQuery = injectQuery(() => ({
    queryKey: ['demands', 'open'],
    queryFn: () => this.demandService.getOpenDemands()
  }));

  offers = computed(() => (this.offersQuery.data() ?? []).slice(0, 3));

  topWashersQuery = injectQuery(() => ({
    queryKey: ['washers', 'top'],
    queryFn: () => this.demandService.getTopWashers()
  }));

  topWashers = computed<TopWasher[]>(() => (this.topWashersQuery.data() ?? []).slice(0, 6));

  vehicleLabel(d: DemandResponseDto) { return vehicleLabel(d.vehicleType, this.i18n.currentLang()); }
  washLabel(d: DemandResponseDto) { return washLabel(d.washType, this.i18n.currentLang()); }
  neighborhood(d: DemandResponseDto) { return neighborhood(d.location.address); }
  timeLabel(d: DemandResponseDto) { return relativeTime(d.createdAt, this.i18n.currentLang()); }
  carImage(d: DemandResponseDto) { return vehicleImage(d.vehicleType); }

  clientSteps = [
    { titleKey: 'howItWorks.step1_title', descKey: 'howItWorks.step1_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>' },
    { titleKey: 'howItWorks.step2_title', descKey: 'howItWorks.step2_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>' },
    { titleKey: 'howItWorks.step3_title', descKey: 'howItWorks.step3_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>' },
    { titleKey: 'howItWorks.step4_title', descKey: 'howItWorks.step4_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }
  ];

  washerSteps = [
    { titleKey: 'howItWorks.washer_step1_title', descKey: 'howItWorks.washer_step1_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>' },
    { titleKey: 'howItWorks.washer_step2_title', descKey: 'howItWorks.washer_step2_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' },
    { titleKey: 'howItWorks.washer_step3_title', descKey: 'howItWorks.washer_step3_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h4m0 0l-4-4m4 4l-4 4M5 5h4v4H5V5z"></path></svg>' },
    { titleKey: 'howItWorks.washer_step4_title', descKey: 'howItWorks.washer_step4_desc', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>' }
  ];

  currentSteps = computed(() => this.audience() === 'client' ? this.clientSteps : this.washerSteps);

  trustFeatures = [
    { titleKey: 'trust.title1', descKey: 'trust.desc1', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>' },
    { titleKey: 'trust.title2', descKey: 'trust.desc2', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>' },
    { titleKey: 'trust.title3', descKey: 'trust.desc3', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>' },
    { titleKey: 'trust.title4', descKey: 'trust.desc4', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-3.04 8.4-7.2 9.618a1.5 1.5 0 01-1.6 0C7.04 20.4 4 16.556 4 12V6.5a1.5 1.5 0 01.9-1.373l6.75-2.917a1.5 1.5 0 011.2 0l6.75 2.917a1.5 1.5 0 01.9 1.373V12z"></path></svg>' }
  ];

  reviews = [
    { nameKey: 'testimonials.review1_name', textKey: 'testimonials.review1_text', rating: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
    { nameKey: 'testimonials.review2_name', textKey: 'testimonials.review2_text', rating: 5, avatar: 'https://i.pravatar.cc/150?img=11' },
    { nameKey: 'testimonials.review3_name', textKey: 'testimonials.review3_text', rating: 4, avatar: 'https://i.pravatar.cc/150?img=20' }
  ];
}
