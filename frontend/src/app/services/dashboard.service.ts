import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import {
  AdminDashboardData,
  BookingAnalyticsData,
  BookingAnalyticsParams,
  RevenueStatsData,
  RevenueStatsParams,
  TopUser,
  UserDashboardData,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  http = inject(HttpClient);
  private api = environment.apiBaseUrl;
  auth = inject(AuthService);

  getUserDashboard(): Observable<any> {
    return this.http
      .get(`${this.api}/dashboard/user`, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data as UserDashboardData,
              message: res.message || 'User dashboard retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to fetch user dashboard');
          }
        }),
        catchError(this.handleError)
      );
  }

  getAdminDashboard(): Observable<any> {
    return this.http
      .get(`${this.api}/dashboard/admin`, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data as AdminDashboardData,
              message: res.message || 'Admin dashboard retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to fetch admin dashboard');
          }
        }),
        catchError(this.handleError)
      );
  }

  getAdminRevenueStats(params?: RevenueStatsParams): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.startDate) {
        httpParams = httpParams.set('startDate', params.startDate);
      }
      if (params.endDate) {
        httpParams = httpParams.set('endDate', params.endDate);
      }
    }

    return this.http
      .get(`${this.api}/dashboard/admin/revenue`, {
        headers: this.auth.getAuthHeaders(),
        params: httpParams,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data as RevenueStatsData,
              message:
                res.message || 'Revenue statistics retrieved successfully',
            };
          } else {
            throw new Error(
              res.message || 'Failed to fetch revenue statistics'
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  getAdminBookingAnalytics(params?: BookingAnalyticsParams): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.startDate) {
        httpParams = httpParams.set('startDate', params.startDate);
      }
      if (params.endDate) {
        httpParams = httpParams.set('endDate', params.endDate);
      }
    }

    return this.http
      .get(`${this.api}/dashboard/admin/bookings-analytics`, {
        headers: this.auth.getAuthHeaders(),
        params: httpParams,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data as BookingAnalyticsData,
              message:
                res.message || 'Booking analytics retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to fetch booking analytics');
          }
        }),
        catchError(this.handleError)
      );
  }

  getAdminTopUsersByBookings(): Observable<any> {
    return this.http
      .get(`${this.api}/dashboard/admin/top-users`, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data as TopUser[],
              message: res.message || 'Top users retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to fetch top users');
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    const errorMessage =
      error.error?.message || error.message || 'An error occurred';
    return throwError(() => new Error(errorMessage));
  }
}
