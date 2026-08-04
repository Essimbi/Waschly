import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface NavItem {
  iconSvg: string;
  label: string;
  route: string;
  badgeCount?: number;
}

/**
 * ShellComponent
 * @description
 * Main layout shell. 
 * Mobile (< md): Bottom navigation bar.
 * Desktop (>= md): Left sidebar.
 */
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-page">
      
      <!-- Desktop Sidebar (hidden on mobile) -->
      <aside class="hidden md:flex flex-col w-64 h-full bg-white border-r border-gray-100 z-30 shrink-0">
        
        <!-- Header / Logo -->
        <div class="p-6 flex items-center gap-3">
          <div class="w-9 h-9 bg-accent-600 rounded-xl flex items-center justify-center shadow-soft-sm">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <span class="font-bold text-xl text-gray-900 tracking-tight block">Waschly</span>
            <span class="text-[10px] font-bold text-accent-600 tracking-wider uppercase">Client Portal</span>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="flex-1 px-4 space-y-1 overflow-y-auto mt-2">
          <p class="px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Menü</p>
          @for (item of items(); track item.route) {
            <a 
              [routerLink]="item.route"
              routerLinkActive="bg-accent-50 text-accent-700 font-semibold shadow-sm"
              #rla="routerLinkActive"
              [routerLinkActiveOptions]="{ exact: item.route === '/client' }"
              class="group relative flex items-center justify-between px-4 py-3 rounded-2xl transition-[background-color,color,box-shadow,transform] duration-200 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 active:scale-[0.98] mb-1"
              [ngClass]="!rla.isActive ? 'text-gray-600 hover:text-gray-900' : ''"
              [attr.aria-current]="rla.isActive ? 'page' : null"
            >
              <!-- Active Indicator Pill -->
              <div *ngIf="rla.isActive" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent-600 rounded-r-full"></div>
              
              <div class="flex items-center gap-3">
                <div 
                  [innerHTML]="item.iconSvg" 
                  class="w-5 h-5 transition-transform duration-200"
                  [ngClass]="rla.isActive ? 'fill-current stroke-current text-accent-600 scale-110' : 'fill-none stroke-current text-gray-400 group-hover:text-gray-600 group-hover:scale-110'"
                ></div>
                <span [class.font-medium]="!rla.isActive">{{ item.label }}</span>
              </div>
              
              <!-- Badge -->
              <span *ngIf="item.badgeCount" class="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                {{ item.badgeCount }}
              </span>
            </a>
          }
        </nav>
        
        <!-- Footer / User Profile Mock -->
        <div class="p-4 m-4 rounded-2xl bg-surface-2 border border-gray-100 cursor-pointer hover:bg-white hover:shadow-soft-sm hover:border-gray-200 transition-all duration-300 group">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-accent-100 text-accent-700 flex items-center justify-center font-bold shrink-0 shadow-inner group-hover:bg-accent-200 transition-colors">
              JW
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-gray-900 truncate">Julia Wagner</p>
              <p class="text-xs text-gray-500 truncate">julia&#64;example.com</p>
            </div>
            <svg class="w-5 h-5 text-gray-400 shrink-0 group-hover:text-accent-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
            </svg>
          </div>
        </div>
      </aside>
      
      <!-- Main Content Area -->
      <main class="flex-1 h-full overflow-y-auto relative pb-20 md:pb-0">
        <ng-content></ng-content>
      </main>

      <!-- Mobile Bottom Nav (hidden on desktop) -->
      <nav class="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 pb-safe md:hidden border-t border-gray-100 shadow-[0_-8px_30px_rgba(15,45,88,0.04)]">
        <ul class="flex items-center justify-around h-16 px-2">
          @for (item of items(); track item.route) {
            <li class="flex-1 relative flex justify-center">
              <a 
                [routerLink]="item.route"
                routerLinkActive="text-accent-700"
                #rla2="routerLinkActive"
                [routerLinkActiveOptions]="{ exact: item.route === '/client' }"
                class="flex flex-col items-center justify-center h-full w-full space-y-1 transition-all duration-200 focus:outline-none focus-visible:bg-gray-100"
                [ngClass]="!rla2.isActive ? 'text-gray-500 hover:text-gray-900 active:scale-95' : 'active:scale-95'"
                [attr.aria-current]="rla2.isActive ? 'page' : null"
              >
                <div class="relative flex items-center justify-center w-12 h-8 rounded-full transition-colors duration-300"
                     [ngClass]="rla2.isActive ? 'bg-accent-100' : 'bg-transparent'">
                  <div 
                    [innerHTML]="item.iconSvg" 
                    class="w-5 h-5 transition-transform duration-300"
                    [ngClass]="rla2.isActive ? 'fill-current stroke-current scale-110 text-accent-700' : 'fill-none stroke-current'"
                  ></div>
                  <!-- Notification Badge -->
                  <span *ngIf="item.badgeCount" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm z-10">
                    {{ item.badgeCount }}
                  </span>
                </div>
                <span class="text-[10px] font-semibold" [ngClass]="rla2.isActive ? 'text-accent-700' : 'text-gray-500'">{{ item.label }}</span>
              </a>
            </li>
          }
        </ul>
      </nav>

    </div>
  `
})
export class ShellComponent {
  items = input.required<NavItem[]>();
}
