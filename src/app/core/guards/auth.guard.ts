import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
// import { UserState } from '../../features/auth/application/state/user.state';

export const authGuard: CanActivateFn = () => {
  // const userState = inject(UserState);
  const router = inject(Router);

  // if (!userState.isAuthenticated()) {
  //   router.navigate(['/auth']);
  //   return false;
  // }

  return true;
};