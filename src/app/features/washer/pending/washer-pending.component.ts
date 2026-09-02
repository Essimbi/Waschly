import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/actions/button/button.component';
import { AuthService } from '../../../core/auth/auth.service';
import { TranslatePipe } from '../../../shared/i18n/translate.pipe';

@Component({
  selector: 'app-washer-pending',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TranslatePipe],
  template: `
    <div class="min-h-screen bg-page flex items-center justify-center p-6">
      <div class="max-w-md w-full text-center">
        @if (status() === 'rejected') {
          <div class="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </div>
          <h1 class="font-display text-2xl font-semibold text-text-main mb-3">{{ 'washer.pending.rejectedTitle' | translate }}</h1>
          <p class="text-text-muted mb-8">{{ 'washer.pending.rejectedDescription' | translate }}</p>
        } @else {
          <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h1 class="font-display text-2xl font-semibold text-text-main mb-3">{{ 'washer.pending.pendingTitle' | translate }}</h1>
          <p class="text-text-muted mb-8">{{ 'washer.pending.pendingDescription' | translate }}</p>
        }
        <app-button variant="secondary" (click)="logout()">{{ 'washer.pending.logoutButton' | translate }}</app-button>
      </div>
    </div>
  `
})
export class WasherPendingComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  status() {
    return this.authService.currentUser()?.verificationStatus ?? 'pending';
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
