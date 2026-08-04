import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TextareaComponent
 * @description
 * Multi-line text input with label and error support.
 * 
 * @example
 * <app-textarea label="Description" [(value)]="desc"></app-textarea>
 */
@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full">
      <label [for]="id()" class="block text-sm font-semibold text-gray-700 mb-1">
        {{ label() }}
        <span *ngIf="required()" class="text-red-500">*</span>
      </label>
      
      <textarea
        [id]="id()"
        [rows]="rows()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [required]="required()"
        [attr.aria-invalid]="!!error()"
        [attr.aria-describedby]="error() ? id() + '-error' : helperText() ? id() + '-helper' : null"
        [value]="value()"
        (input)="onInput($event)"
        class="block w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 sm:text-sm transition-[border-color,box-shadow] duration-200 resize-y min-h-[80px] disabled:bg-gray-50 disabled:text-gray-500"
        [ngClass]="{
          'border-red-200 text-red-900 placeholder-red-300 focus:border-red-400 focus:ring-red-400/20': !!error(),
          'focus:border-accent-500 focus:ring-accent-500/20': !error()
        }"
      ></textarea>
      
      <p *ngIf="error()" [id]="id() + '-error'" class="mt-1.5 text-xs text-red-600" aria-live="polite">
        {{ error() }}
      </p>
      
      <p *ngIf="helperText() && !error()" [id]="id() + '-helper'" class="mt-1.5 text-xs text-gray-500">
        {{ helperText() }}
      </p>
    </div>
  `
})
export class TextareaComponent {
  id = input<string>(`textarea-${Math.random().toString(36).substr(2, 9)}`);
  
  label = input.required<string>();
  rows = input<number>(3);
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  
  error = input<string | null>(null);
  helperText = input<string | null>(null);
  
  value = model<string>('');

  onInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.value.set(val);
  }
}
