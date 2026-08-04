import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface SelectOption {
  value: string | number;
  label: string;
}

/**
 * SelectComponent
 * @description
 * Native styled select for better mobile accessibility.
 * 
 * @example
 * <app-select label="Vehicle Type" [options]="types" [(value)]="selectedType"></app-select>
 */
@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full">
      <label [for]="id()" class="block text-sm font-semibold text-gray-700 mb-1">
        {{ label() }}
        <span *ngIf="required()" class="text-red-500">*</span>
      </label>
      
      <select
        [id]="id()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.aria-invalid]="!!error()"
        [attr.aria-describedby]="error() ? id() + '-error' : null"
        [value]="value()"
        (change)="onChange($event)"
        class="block w-full pl-3 pr-10 py-2 text-base border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm rounded-xl transition-[border-color,box-shadow] duration-200 disabled:bg-gray-50 disabled:text-gray-500"
        [ngClass]="{
          'border-red-200 text-red-900 focus:border-red-400 focus:ring-red-400/20': !!error(),
          'focus:border-accent-500 focus:ring-accent-500/20': !error()
        }"
      >
        <option value="" disabled selected *ngIf="placeholder()">{{ placeholder() }}</option>
        @for (option of options(); track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
        }
      </select>
      
      <p *ngIf="error()" [id]="id() + '-error'" class="mt-1.5 text-xs text-red-600" aria-live="polite">
        {{ error() }}
      </p>
    </div>
  `
})
export class SelectComponent {
  id = input<string>(`select-${Math.random().toString(36).substr(2, 9)}`);
  
  label = input.required<string>();
  options = input.required<SelectOption[]>();
  
  placeholder = input<string>('Select an option...');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  error = input<string | null>(null);
  
  value = model<string | number>('');

  onChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.value.set(val);
  }
}
