import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protects private routes — redirects to /login if not logged in
export const authGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) return true;

  router.navigate(['/login']);
  return false;
};

// Prevents logged-in users from visiting /login or /register
// Redirects to /dashboard instead
export const guestGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

// Restricts route to partyMaster role only
// Mirrors backend roleMiddleware.js restrictTo("partyMaster")
export const partyMasterGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isPartyMaster()) return true;

  router.navigate(['/dashboard']);
  return false;
};

// Restricts route to commissioner role only
// Mirrors backend roleMiddleware.js restrictTo("commissioner")
export const commissionerGuard: CanActivateFn = () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && auth.isCommissioner()) return true;

  router.navigate(['/dashboard']);
  return false;
};