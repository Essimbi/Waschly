import { Component, ChangeDetectionStrategy, signal, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BackgroundParticlesComponent } from './background-particles.component';
import { PublicFooterComponent } from './public-footer.component';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';
import { I18nService } from '../../../shared/i18n/i18n.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    BackgroundParticlesComponent,
    PublicFooterComponent,
    TranslatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col min-h-screen bg-page text-gray-900 dark:text-gray-100 transition-colors duration-300 relative">
      <app-background-particles></app-background-particles>
      
      <!-- Sticky Header with Glassmorphism -->
      <header class="sticky top-0 z-50 backdrop-blur-md bg-surface/80 dark:bg-surface/80 border-b border-gray-200/50 dark:border-gray-800/50 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <a routerLink="/" class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                Waschly
              </a>
            </div>
            
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-8">
              <a routerLink="/" routerLinkActive="text-primary-600 dark:text-primary-400 font-medium" [routerLinkActiveOptions]="{exact: true}" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                {{ 'nav.home' | translate }}
              </a>
              <a routerLink="/pricing" routerLinkActive="text-primary-600 dark:text-primary-400 font-medium" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                {{ 'nav.pricing' | translate }}
              </a>
              <a routerLink="/partner" routerLinkActive="text-primary-600 dark:text-primary-400 font-medium" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                {{ 'nav.partner' | translate }}
              </a>
              <a routerLink="/faq" routerLinkActive="text-primary-600 dark:text-primary-400 font-medium" class="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">
                {{ 'nav.faq' | translate }}
              </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center space-x-3">
              <!-- Language Toggle -->
              <button 
                (click)="toggleLanguage()" 
                class="flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
                aria-label="Toggle language">
                {{ currentLang() === 'de' ? '🇩🇪' : '🇬🇧' }}
              </button>

              <!-- Dark Mode Toggle -->
              <button 
                (click)="toggleDarkMode()" 
                class="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
                aria-label="Toggle dark mode">
                <!-- Sun Icon -->
                <svg *ngIf="isDarkMode()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <!-- Moon Icon -->
                <svg *ngIf="!isDarkMode()" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              
              <a routerLink="/login" class="hidden sm:inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 dark:bg-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 shadow-sm transition-colors duration-200">
                {{ 'nav.login' | translate }}
              </a>
              
              <!-- Mobile menu button -->
              <div class="md:hidden flex items-center">
                <button type="button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200" aria-controls="mobile-menu" aria-expanded="false">
                  <span class="sr-only">Open main menu</span>
                  <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow flex flex-col relative z-0">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <app-public-footer></app-public-footer>
    </div>
  `
})
export class PublicLayoutComponent implements OnInit {
  isDarkMode = signal(false);
  private isBrowser: boolean;
  public currentLang;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private i18n: I18nService) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentLang = this.i18n.currentLang;
  }

  ngOnInit() {
    if (this.isBrowser) {
      const storedPref = localStorage.getItem('theme');
      if (storedPref === 'dark' || (!storedPref && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        this.isDarkMode.set(true);
        document.documentElement.classList.add('dark');
      } else {
        this.isDarkMode.set(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }

  toggleDarkMode() {
    if (!this.isBrowser) return;
    
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleLanguage() {
    this.i18n.toggleLanguage();
  }
}
