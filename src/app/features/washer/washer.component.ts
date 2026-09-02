import { Component, inject, computed } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { ShellComponent, NavItem } from '../../shared/ui/layout/shell/shell.component';
import { WasherPendingComponent } from './pending/washer-pending.component';
import { DemandService } from '../../core/data/demand.service';
import { AuthService } from '../../core/auth/auth.service';
import { I18nService } from '../../shared/i18n/i18n.service';

@Component({
  selector: 'app-washer',
  standalone: true,
  imports: [RouterOutlet, ShellComponent, WasherPendingComponent],
  template: `
    @if (isVerified()) {
      <app-shell
        [items]="navItems()"
        [portalLabel]="portalLabel()"
        [userName]="userName()"
        [userEmail]="userEmail()"
        profileRoute="/washer/profile"
        (logout)="logout()"
      >
        <router-outlet></router-outlet>
      </app-shell>
    } @else {
      <app-washer-pending></app-washer-pending>
    }
  `
})
export class WasherComponent {
  private demandService = inject(DemandService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private i18n = inject(I18nService);

  portalLabel = computed(() => this.i18n.t('shell.washerPortal'));

  isVerified = computed(() => this.authService.currentUser()?.verificationStatus === 'approved');
  userName = computed(() => {
    const u = this.authService.currentUser();
    return u ? `${u.firstName} ${u.lastName}` : '';
  });
  userEmail = computed(() => this.authService.currentUser()?.email ?? '');

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  openDemandsQuery = injectQuery(() => ({
    queryKey: ['demands', 'open'],
    queryFn: () => this.demandService.getOpenDemands(),
    refetchInterval: 15_000,
    enabled: this.isVerified()
  }));

  activeJobsQuery = injectQuery(() => ({
    queryKey: ['washer', 'jobs', 'mine'],
    queryFn: () => this.demandService.getMyAssignedJobs(),
    enabled: this.isVerified()
  }));

  activeJobsCount = computed(() => {
    const jobs = this.activeJobsQuery.data();
    if (!jobs) return 0;
    return jobs.filter(d => d.status === 'assigned' || d.status === 'in_progress').length;
  });

  navItems = computed<NavItem[]>(() => [
    {
      label: this.i18n.t('shell.navListings'),
      route: '/washer',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 014-4h4m0 0l-4-4m4 4l-4 4M5 5h4v4H5V5z"></path></svg>',
      badgeCount: this.openDemandsQuery.data()?.length || undefined
    },
    {
      label: this.i18n.t('shell.navActive'),
      route: '/washer/active',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
      badgeCount: this.activeJobsCount() > 0 ? this.activeJobsCount() : undefined
    },
    {
      label: this.i18n.t('shell.navHistory'),
      route: '/washer/history',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>'
    },
    {
      label: this.i18n.t('shell.navProfile'),
      route: '/washer/profile',
      iconSvg: '<svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
    }
  ]);
}
