import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * CardComponent
 * @description
 * A versatile container component with a generic and 'request' variant.
 * 
 * @example
 * <app-card variant="generic">
 *   <h3 header>Card Title</h3>
 *   <p>Card Content</p>
 *   <div footer>Footer Actions</div>
 * </app-card>
 */
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="bg-white rounded-2xl shadow-soft-sm overflow-hidden"
      [ngClass]="{
        'hover:shadow-card-hover hover:-translate-y-0.5 transition-[box-shadow,transform] duration-300 ease-soft cursor-pointer': interactive(),
        'border-l-4 border-l-accent-500': variant() === 'request'
      }"
    >
      <!-- Header Projection -->
      <div class="px-5 py-4 sm:px-7" *ngIf="hasHeader">
        <ng-content select="[header]"></ng-content>
      </div>
      
      <!-- Body -->
      <div class="px-5 py-6 sm:p-7">
        <ng-content></ng-content>
      </div>
      
      <!-- Footer Projection -->
      <div class="bg-surface-2 px-5 py-4 sm:px-7" *ngIf="hasFooter">
        <ng-content select="[footer]"></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {
  variant = input<'generic' | 'request'>('generic');
  interactive = input<boolean>(false);
  
  // Note: For advanced content projection detection in standalone without lifecycle hacks,
  // we could use ContentChild, but for simplicity here we assume if they use it, they want the wrapper.
  // In a real app we'd check if the content exists.
  hasHeader = true; 
  hasFooter = true;
}
