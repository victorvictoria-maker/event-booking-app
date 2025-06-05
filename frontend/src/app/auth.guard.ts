import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = Boolean(localStorage.getItem('event-booking-app-token'));
    const isAdmin = localStorage.getItem('event-booking-is-admin') === 'true';
    const currentPath = state.url;

    if (!isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (isAdmin && !currentPath.startsWith('/admin')) {
      this.router.navigateByUrl('admin/login');
      return false;
    }

    if (!isAdmin && currentPath.startsWith('/admin')) {
      this.router.navigateByUrl('login');
      return false;
    }

    return true;
  }
}
