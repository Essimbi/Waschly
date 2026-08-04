import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

/**
 * ToastService
 * @description
 * Global service for managing toast notifications using Angular Signals.
 * 
 * @example
 * toastService.show('success', 'Profile updated successfully!');
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  #toasts = signal<Toast[]>([]);
  readonly toasts = this.#toasts.asReadonly();

  show(type: ToastType, message: string, durationMs = 3000) {
    const id = Math.random().toString(36).substring(2, 9);
    this.#toasts.update(toasts => [...toasts, { id, type, message }]);

    if (durationMs > 0) {
      setTimeout(() => this.remove(id), durationMs);
    }
  }

  remove(id: string) {
    this.#toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
