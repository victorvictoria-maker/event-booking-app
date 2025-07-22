import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  public authService = inject(AuthService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    const isAdmin = this.authService.isAdmin();
    const currentPath = state.url;

    if (!isLoggedIn) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    if (isAdmin && !currentPath.startsWith('/admin')) {
      if (!currentPath.startsWith('/admin/login')) {
        this.router.navigateByUrl('/admin/login');
      }
      return false;
    }

    if (!isAdmin && currentPath.startsWith('/admin')) {
      if (!currentPath.startsWith('/login')) {
        this.router.navigateByUrl('/login');
      }
      return false;
    }
    return true;
  }
}
