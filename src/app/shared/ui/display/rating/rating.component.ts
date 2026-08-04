import { Component, input, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * RatingComponent
 * @description
 * 5-star rating display and input component.
 * 
 * @example
 * <app-rating [readonly]="true" [value]="4.5"></app-rating>
 * <app-rating [(value)]="userRating"></app-rating>
 */
@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="flex items-center" 
      [attr.role]="readonly() ? 'img' : 'radiogroup'" 
      [attr.aria-label]="readonly() ? value() + ' out of 5 stars' : 'Rate 1 to 5 stars'"
    >
      <div 
        *ngFor="let star of stars; let i = index"
        class="relative flex items-center justify-center"
        [ngClass]="{ 'cursor-pointer': !readonly() }"
        (click)="setRating(i + 1)"
        (mouseenter)="hoverRating = i + 1"
        (mouseleave)="hoverRating = 0"
      >
        <!-- Background empty star -->
        <svg class="text-gray-300" [ngClass]="sizeClass()" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>

        <!-- Foreground filled star (supports partial fill for readonly mode) -->
        <svg 
          class="absolute top-0 left-0 text-yellow-400 overflow-hidden" 
          [ngClass]="sizeClass()" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          [style.width]="getFillPercentage(i + 1) + '%'"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        
        <!-- Screen reader support for interactive mode -->
        <input 
          *ngIf="!readonly()"
          type="radio" 
          name="rating" 
          [value]="i + 1"
          class="sr-only"
          [attr.aria-label]="(i + 1) + ' star' + (i === 0 ? '' : 's')"
          [checked]="value() === (i + 1)"
          (change)="setRating(i + 1)"
        >
      </div>
    </div>
  `
})
export class RatingComponent {
  value = model<number>(0);
  readonly = input<boolean>(false);
  size = input<'sm' | 'md' | 'lg'>('md');

  stars = Array(5).fill(0);
  hoverRating = 0;

  sizeClass = computed(() => {
    switch (this.size()) {
      case 'sm': return 'h-4 w-4';
      case 'lg': return 'h-8 w-8';
      case 'md': 
      default: return 'h-5 w-5';
    }
  });

  getFillPercentage(starIndex: number): number {
    const currentVal = !this.readonly() && this.hoverRating > 0 ? this.hoverRating : this.value();
    if (currentVal >= starIndex) return 100;
    if (currentVal < starIndex - 1) return 0;
    return (currentVal % 1) * 100;
  }

  setRating(rating: number) {
    if (!this.readonly()) {
      this.value.set(rating);
    }
  }
}
