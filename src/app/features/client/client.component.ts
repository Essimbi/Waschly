import { Component, inject, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ShellComponent, NavItem } from '../../shared/ui/layout/shell/shell.component';
import { DemandService } from '../../core/data/demand.service';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [RouterOutlet, ShellComponent],
  template: `
    <app-shell
      [items]="navItems()"
      [portalLabel]="portalLabel()"
      [userName]="userName()"
      [userEmail]="userEmail()"
      profileRoute="/client/profile"
      (logout)="logout()"
    >
      <router-outlet></router-outlet>
    </app-shell>
  `
})
export class ClientComponent {
  private demandService = inject(DemandService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  portalLabel = computed(() => this.i18n.t('shell.clientPortal'));

  userName = computed(() => {
    const u = this.authService.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  userEmail = computed(() => this.authService.currentUser()?.email ?? '');

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  demandsQuery = injectQuery(() => ({
    queryKey: ['demands', 'my'],
    queryFn: () => this.demandService.getMyDemands()
  }));

  activeDemandsCount = computed(() => {
    const demands = this.demandsQuery.data();
    if (!demands) return 0;
    return demands.filter(d => ['open', 'assigned', 'in_progress'].includes(d.status)).length;
  });

  navItems = computed<NavItem[]>(() => [
    {
      label: this.i18n.t('shell.navHome'),
      route: '/client',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>',
      badgeCount: this.activeDemandsCount() > 0 ? this.activeDemandsCount() : undefined
    },
    {
      label: this.i18n.t('shell.navHistory'),
      route: '/client/history',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>'
    },
    {
      label: this.i18n.t('shell.navNew'),
      route: '/client/new',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>'
    },
    {
      label: this.i18n.t('shell.navProfile'),
      route: '/client/profile',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
    }
  ]);
}
