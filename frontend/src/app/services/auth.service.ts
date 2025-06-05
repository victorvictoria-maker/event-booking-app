import { inject, Injectable } from '@angular/core';
import { User } from '../models/auth.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  router = inject(Router);
  private api = environment.apiBaseUrl;

  register(user: User): Observable<any> {
    const { username, email, password, isAdmin } = user;
    return this.http
      .post(`${this.api}/auth/signup`, {
        username,
        email,
        password,
        isAdmin,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'CREATED' && res.data.token) {
            localStorage.setItem(
              'event-booking-app-token',
              JSON.stringify(res.data.token)
            );
            localStorage.setItem(
              'event-booking-is-admin',
              JSON.stringify(res.data.user.isAdmin)
            );

            console.log(res.data.user.isAdmin);

            return {
              success: true,
              message: 'Registration successful',
              isAdmin: res.data.user.isAdmin,
            };
          } else if (res.status === 'ERROR') {
            throw new Error(res.message);
          } else {
            throw new Error(res?.data?.message || 'Registration failed');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.log(error.error?.message);
          const errorMessage =
            error.error?.message || 'Registration failed. Please try again.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  login(identifier: string, password: string): Observable<any> {
    return this.http
      .post(`${this.api}/auth/signin`, { identifier, password })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            console.log(res);
            localStorage.setItem(
              'event-booking-app-token',
              JSON.stringify(res.data.token)
            );
            localStorage.setItem(
              'event-booking-is-admin',
              JSON.stringify(res.data.user.isAdmin)
            );

            return { success: true, message: 'Login successful' };
          } else if (res.status === 'ERROR') {
            throw new Error(res.message);
          } else {
            throw new Error(res?.data?.message || 'Login failed');
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('HTTP Error:', error);
          const errorMessage =
            error.error?.message || 'Login failed. Please try again.';
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  logout(): void {
    localStorage.removeItem('event-booking-app-token');
    localStorage.removeItem('event-booking-is-admin');
    this.router.navigateByUrl('login');
  }
}
