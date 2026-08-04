import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

/**
 * ToastComponent
 * @description
 * Displays active toasts from the ToastService in a fixed container.
 * Should be placed once in the app root (app.component.html).
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(1rem)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(1rem)' }))
      ])
    ])
  ],
  template: `
    <div class="fixed z-50 flex flex-col gap-3 bottom-4 right-4 max-w-sm w-full" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          @toastAnimation
          class="flex items-start p-4 rounded-2xl shadow-overlay backdrop-blur-sm"
          [ngClass]="{
            'bg-green-50 text-green-800': toast.type === 'success',
            'bg-red-50 text-red-800': toast.type === 'error',
            'bg-blue-50 text-blue-800': toast.type === 'info'
          }"
          role="alert"
        >
          <div class="flex-shrink-0">
            <!-- Success Icon -->
            <svg *ngIf="toast.type === 'success'" class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <!-- Error Icon -->
            <svg *ngIf="toast.type === 'error'" class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <!-- Info Icon -->
            <svg *ngIf="toast.type === 'info'" class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium">{{ toast.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button 
              type="button"
              (click)="toastService.remove(toast.id)" 
              class="inline-flex rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              [ngClass]="{
                'text-green-500 hover:text-green-600 focus-visible:ring-green-600': toast.type === 'success',
                'text-red-500 hover:text-red-600 focus-visible:ring-red-600': toast.type === 'error',
                'text-blue-500 hover:text-blue-600 focus-visible:ring-blue-600': toast.type === 'info'
              }"
              aria-label="Close"
            >
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
