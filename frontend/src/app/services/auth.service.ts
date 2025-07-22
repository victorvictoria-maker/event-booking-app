import { inject, Injectable } from '@angular/core';
import { User } from '../models/auth.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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

  private storeAuthData(
    token: string,
    isAdmin: boolean,
    username: string
  ): void {
    localStorage.setItem('event-booking-app-token', JSON.stringify(token));
    localStorage.setItem('event-booking-is-admin', JSON.stringify(isAdmin));
    localStorage.setItem(
      'event-booking-app-username',
      JSON.stringify(username)
    );
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

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
            this.storeAuthData(
              res.data.token,
              res.data.user.isAdmin,
              res.data.user.username
            );
            // console.log(res.data.user.isAdmin);

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
            this.storeAuthData(
              res.data.token,
              res.data.user.isAdmin,
              res.data.user.username
            );

            return {
              success: true,
              message: 'Login successful',
              isAdmin: res.data.user.isAdmin,
            };
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
    localStorage.removeItem('event-booking-app-username');
    this.router.navigateByUrl('login');
  }

  getToken(): string | null {
    return JSON.parse(
      localStorage.getItem('event-booking-app-token') || 'null'
    );
  }

  isAdmin(): boolean {
    return JSON.parse(
      localStorage.getItem('event-booking-is-admin') || 'false'
    );
  }

  getUsername(): string | null {
    return JSON.parse(
      localStorage.getItem('event-booking-app-username') || 'null'
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
