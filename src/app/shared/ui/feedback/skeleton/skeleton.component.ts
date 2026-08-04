import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * SkeletonComponent
 * @description
 * A placeholder component used during loading states.
 * 
 * @example
 * <app-skeleton shape="circle" width="w-12" height="h-12"></app-skeleton>
 * <app-skeleton shape="text" width="w-full"></app-skeleton>
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="animate-pulse bg-accent-50"
      [ngClass]="classes()"
      aria-hidden="true"
    ></div>
  `
})
export class SkeletonComponent {
  shape = input<'text' | 'circle' | 'rect'>('text');
  width = input<string>('w-full');
  height = input<string>('h-4'); // Default height for text

  classes = computed(() => {
    let shapeClass = '';
    switch (this.shape()) {
      case 'circle':
        shapeClass = 'rounded-full';
        break;
      case 'rect':
        shapeClass = 'rounded-2xl';
        break;
      case 'text':
      default:
        shapeClass = 'rounded-lg';
        break;
    }
    return `${shapeClass} ${this.width()} ${this.height()}`;
  });
}
