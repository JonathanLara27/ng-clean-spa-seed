import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { UserState } from '../../features/auth/application/state/user.state';

export const guestGuard: CanActivateFn = () => {
  // const userState = inject(UserState);
  const router = inject(Router);

  // if (userState.isAuthenticated()) {
  //   router.navigate(['/']);
  //   return false;
  // }

  return true;
};