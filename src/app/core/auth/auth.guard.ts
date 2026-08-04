import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService, Role } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.currentUser()) {
    return true;
  }
  
  return router.parseUrl('/login');
};

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const userRole = authService.userRole();

    if (authService.currentUser() && userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    // Redirect to an unauthorized page or home if the role doesn't match
    return router.parseUrl('/');
  };
};
