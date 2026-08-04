import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AvatarComponent
 * @description
 * Displays a user image or their initials if the image is missing or fails to load.
 * 
 * @example
 * <app-avatar src="url.jpg" name="John Doe" size="lg"></app-avatar>
 */
@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      [ngClass]="classes()"
      class="relative flex items-center justify-center rounded-full overflow-hidden bg-accent-100 text-accent-700 font-medium shrink-0"
    >
      <img 
        *ngIf="src() && !imageError()" 
        [src]="src()" 
        [alt]="name()" 
        (error)="onImageError()"
        class="w-full h-full object-cover"
      />
      <span *ngIf="!src() || imageError()">
        {{ initials() }}
      </span>
    </div>
  `
})
export class AvatarComponent {
  src = input<string | null>(null);
  name = input.required<string>();
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  imageError = signal(false);

  classes = computed(() => {
    switch (this.size()) {
      case 'sm': return 'w-8 h-8 text-xs';
      case 'lg': return 'w-14 h-14 text-xl';
      case 'xl': return 'w-20 h-20 text-2xl';
      case 'md': 
      default: return 'w-10 h-10 text-sm';
    }
  });

  initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  });

  onImageError() {
    this.imageError.set(true);
  }
}
