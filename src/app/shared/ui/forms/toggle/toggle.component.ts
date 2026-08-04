import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ToggleComponent
 * @description
 * Accessible switch/toggle component based on a button role="switch".
 * 
 * @example
 * <app-toggle label="Enable notifications" [(checked)]="notifications"></app-toggle>
 */
@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-between">
      <span class="flex flex-col">
        <label [id]="id() + '-label'" class="text-sm font-medium text-gray-900" (click)="toggle()">
          {{ label() }}
        </label>
        <span *ngIf="description()" [id]="id() + '-description'" class="text-sm text-gray-500">
          {{ description() }}
        </span>
      </span>
      
      <button 
        type="button" 
        [id]="id()"
        role="switch" 
        [attr.aria-checked]="checked()"
        [attr.aria-labelledby]="id() + '-label'"
        [attr.aria-describedby]="description() ? id() + '-description' : null"
        [disabled]="disabled()"
        (click)="toggle()"
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        [ngClass]="checked() ? 'bg-primary-600' : 'bg-gray-200'"
      >
        <span 
          aria-hidden="true" 
          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
          [ngClass]="checked() ? 'translate-x-5' : 'translate-x-0'"
        ></span>
      </button>
    </div>
  `
})
export class ToggleComponent {
  id = input<string>(`toggle-${Math.random().toString(36).substr(2, 9)}`);
  
  label = input.required<string>();
  description = input<string | null>(null);
  disabled = input<boolean>(false);
  
  checked = model<boolean>(false);

  toggle() {
    if (!this.disabled()) {
      this.checked.set(!this.checked());
    }
  }
}
