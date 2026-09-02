import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollRevealDirective } from '../../../../shared/ui/animations/scroll-reveal.directive';
import { Tilt3DDirective } from '../../../../shared/ui/animations/tilt-3d.directive';
import { TranslatePipe } from '../../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective, Tilt3DDirective, TranslatePipe],
  template: `
    <div class="pt-32 pb-24 overflow-hidden">
      <!-- Hero -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div class="text-center max-w-4xl mx-auto" appScrollReveal>
          <h1 class="text-5xl font-extrabold tracking-tight text-text-main md:text-6xl mb-6">
            {{ 'about.hero_title' | translate }}
          </h1>
          <p class="text-xl md:text-2xl text-text-muted leading-relaxed">
            {{ 'about.hero_subtitle' | translate }}
          </p>
        </div>
      </div>
      
      <!-- Mission -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div appScrollReveal="{ delay: 200, direction: 'left' }">
            <h2 class="text-3xl md:text-4xl font-bold text-text-main mb-8">{{ 'about.mission_title' | translate }}</h2>
            <div class="space-y-6 text-lg text-text-muted">
              <p>{{ 'about.mission_desc1' | translate }}</p>
              <p>{{ 'about.mission_desc2' | translate }}</p>
            </div>
          </div>
          <div class="relative rounded-3xl overflow-hidden shadow-soft-2xl border border-surface-2 group" appScrollReveal="{ delay: 400, direction: 'right' }" appTilt3D>
            <!-- Using an image from a realistic source or placeholder -->
            <div class="aspect-w-4 aspect-h-3 bg-gradient-to-br from-surface to-surface-2 relative">
              <div class="absolute inset-0 bg-accent-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img src="https://images.unsplash.com/photo-1552930294-6b595f4c2974?auto=format&fit=crop&q=80" alt="Mission" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">
            </div>
          </div>
        </div>
      </div>

      <!-- Values (Grid of 4) -->
      <div class="bg-surface-2 py-24 mb-32">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center mb-16" appScrollReveal>
            <h2 class="text-3xl md:text-4xl font-bold text-text-main">{{ 'about.values_title' | translate }}</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="bg-surface p-8 rounded-3xl shadow-soft-sm border border-surface-3 hover:-translate-y-2 transition-transform duration-300" appScrollReveal="{ delay: 100 }">
              <div class="w-14 h-14 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-text-main mb-3">{{ 'about.v1_title' | translate }}</h3>
              <p class="text-text-muted">{{ 'about.v1_desc' | translate }}</p>
            </div>
            
            <div class="bg-surface p-8 rounded-3xl shadow-soft-sm border border-surface-3 hover:-translate-y-2 transition-transform duration-300" appScrollReveal="{ delay: 200 }">
              <div class="w-14 h-14 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-text-main mb-3">{{ 'about.v2_title' | translate }}</h3>
              <p class="text-text-muted">{{ 'about.v2_desc' | translate }}</p>
            </div>

            <div class="bg-surface p-8 rounded-3xl shadow-soft-sm border border-surface-3 hover:-translate-y-2 transition-transform duration-300" appScrollReveal="{ delay: 300 }">
              <div class="w-14 h-14 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-text-main mb-3">{{ 'about.v3_title' | translate }}</h3>
              <p class="text-text-muted">{{ 'about.v3_desc' | translate }}</p>
            </div>

            <div class="bg-surface p-8 rounded-3xl shadow-soft-sm border border-surface-3 hover:-translate-y-2 transition-transform duration-300" appScrollReveal="{ delay: 400 }">
              <div class="w-14 h-14 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 class="text-xl font-bold text-text-main mb-3">{{ 'about.v4_title' | translate }}</h3>
              <p class="text-text-muted">{{ 'about.v4_desc' | translate }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="text-center mb-16" appScrollReveal>
          <h2 class="text-3xl md:text-4xl font-bold text-text-main">{{ 'about.team_title' | translate }}</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <!-- Member 1 -->
          <div class="text-center group" appScrollReveal="{ delay: 100 }">
            <div class="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-soft-lg" appTilt3D>
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" alt="CEO" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <h3 class="text-2xl font-bold text-text-main">{{ 'about.t1_name' | translate }}</h3>
            <p class="text-accent-600 font-medium">{{ 'about.t1_role' | translate }}</p>
          </div>
          <!-- Member 2 -->
          <div class="text-center group" appScrollReveal="{ delay: 200 }">
            <div class="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-soft-lg" appTilt3D>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" alt="CTO" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <h3 class="text-2xl font-bold text-text-main">{{ 'about.t2_name' | translate }}</h3>
            <p class="text-accent-600 font-medium">{{ 'about.t2_role' | translate }}</p>
          </div>
          <!-- Member 3 -->
          <div class="text-center group" appScrollReveal="{ delay: 300 }">
            <div class="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden shadow-soft-lg" appTilt3D>
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400" alt="Head of Ops" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
            </div>
            <h3 class="text-2xl font-bold text-text-main">{{ 'about.t3_name' | translate }}</h3>
            <p class="text-accent-600 font-medium">{{ 'about.t3_role' | translate }}</p>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="bg-accent-600 rounded-3xl p-12 text-white shadow-soft-xl" appScrollReveal>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div class="text-4xl md:text-5xl font-extrabold mb-2">{{ 'about.stat1_value' | translate }}</div>
              <div class="text-accent-100 font-medium">{{ 'about.stat1_label' | translate }}</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-extrabold mb-2">{{ 'about.stat2_value' | translate }}</div>
              <div class="text-accent-100 font-medium">{{ 'about.stat2_label' | translate }}</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-extrabold mb-2">{{ 'about.stat3_value' | translate }}</div>
              <div class="text-accent-100 font-medium">{{ 'about.stat3_label' | translate }}</div>
            </div>
            <div>
              <div class="text-4xl md:text-5xl font-extrabold mb-2">{{ 'about.stat4_value' | translate }}</div>
              <div class="text-accent-100 font-medium">{{ 'about.stat4_label' | translate }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Eco Impact -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="order-2 lg:order-1 relative rounded-3xl overflow-hidden shadow-soft-2xl border border-surface-2 group" appScrollReveal="{ delay: 200, direction: 'left' }" appTilt3D>
            <div class="aspect-w-4 aspect-h-3 bg-gradient-to-br from-green-50 to-green-100 relative">
              <div class="absolute inset-0 bg-green-500/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
              <img src="https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?auto=format&fit=crop&q=80" alt="Eco Impact" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700">
            </div>
          </div>
          <div class="order-1 lg:order-2" appScrollReveal="{ delay: 400, direction: 'right' }">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold mb-6">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clip-rule="evenodd" /></svg>
              <span>100% Umweltfreundlich</span>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-text-main mb-6">{{ 'about.eco_title' | translate }}</h2>
            <p class="text-lg text-text-muted mb-8 leading-relaxed">
              {{ 'about.eco_desc' | translate }}
            </p>
            <div class="flex flex-col sm:flex-row gap-8">
              <div class="border-l-4 border-green-500 pl-4">
                <div class="text-3xl font-extrabold text-text-main mb-1">{{ 'about.eco_stat1' | translate }}</div>
                <div class="text-text-muted font-medium">{{ 'about.eco_label1' | translate }}</div>
              </div>
              <div class="border-l-4 border-green-500 pl-4">
                <div class="text-3xl font-extrabold text-text-main mb-1">{{ 'about.eco_stat2' | translate }}</div>
                <div class="text-text-muted font-medium">{{ 'about.eco_label2' | translate }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Jobs CTA -->
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" appScrollReveal>
        <h2 class="text-3xl font-bold text-text-main mb-4">{{ 'about.jobs_title' | translate }}</h2>
        <p class="text-xl text-text-muted mb-8">{{ 'about.jobs_subtitle' | translate }}</p>
        <button class="bg-text-main hover:bg-black text-white font-bold py-4 px-10 rounded-full shadow-lg transition-transform hover:-translate-y-1">
          {{ 'about.jobs_button' | translate }}
        </button>
      </div>
    </div>
  `
})
export class AboutComponent {}
