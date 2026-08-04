import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
  id: string;
  label: string;
  badge?: string;
}

/**
 * TabsComponent
 * @description
 * Horizontal tabs for navigating between views.
 * 
 * @example
 * <app-tabs [tabs]="myTabs" [(activeTabId)]="currentTab"></app-tabs>
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        @for (tab of tabs(); track tab.id) {
          <button
            type="button"
            (click)="activeTabId.set(tab.id)"
            [attr.aria-current]="activeTabId() === tab.id ? 'page' : undefined"
            class="whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 transition-colors"
            [ngClass]="{
              'border-primary-500 text-primary-600': activeTabId() === tab.id,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300': activeTabId() !== tab.id
            }"
          >
            {{ tab.label }}
            <span 
              *ngIf="tab.badge"
              class="ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
              [ngClass]="{
                'bg-primary-100 text-primary-600': activeTabId() === tab.id,
                'bg-gray-100 text-gray-900': activeTabId() !== tab.id
              }"
            >
              {{ tab.badge }}
            </span>
          </button>
        }
      </nav>
    </div>
  `
})
export class TabsComponent {
  tabs = input.required<Tab[]>();
  activeTabId = model.required<string>();
}
