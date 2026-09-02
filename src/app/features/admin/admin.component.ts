import { Component, inject, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ShellComponent, NavItem } from '../../shared/ui/layout/shell/shell.component';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  template: `
    <app-shell
      [items]="navItems()"
      [portalLabel]="portalLabel()"
      [userName]="userName()"
      [userEmail]="userEmail()"
      (logout)="logout()"
    >
      <router-outlet></router-outlet>
    </app-shell>
  `
})
export class AdminComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  portalLabel = computed(() => this.i18n.t('shell.adminPortal'));

  userName = computed(() => {
    const u = this.authService.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  userEmail = computed(() => this.authService.currentUser()?.email ?? '');

  pendingCount = computed(() => this.authService.pendingWashers().length);

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  navItems = computed<NavItem[]>(() => [
    {
      label: this.i18n.t('shell.navDashboard'),
      route: '/admin',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>'
    },
    {
      label: this.i18n.t('shell.navVerifications'),
      route: '/admin/verifications',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
      badgeCount: this.pendingCount() > 0 ? this.pendingCount() : undefined
    },
    {
      label: this.i18n.t('shell.navUsers'),
      route: '/admin/users',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
    },
    {
      label: this.i18n.t('shell.navDisputes'),
      route: '/admin/disputes',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
    }
  ]);
}
