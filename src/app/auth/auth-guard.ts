import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  // authState returns an observable of the current user
  return authState(auth).pipe(
    take(1), // We only need the current value once
    map(user => {
      if (user) {
        return true; // User is logged in, allow access
      } else {
        // Not logged in, redirect to login page
        router.navigate(['/sign-in']); 
        return false;
      }
    })
  );
};
