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

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  http = inject(HttpClient);
  private api = environment.apiBaseUrl;
  auth = inject(AuthService);

  private getAuthHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createBooking(eventId: string): Observable<any> {
    const data = { eventId };

    return this.http
      .post(`${this.api}/bookings/create`, data, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'CREATED') {
            return {
              status: 'CREATED',
              data: res.data,
              message: res.message || 'Booking created successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to create booking');
          }
        }),
        catchError(this.handleError)
      );
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http
      .delete(`${this.api}/bookings/${bookingId}/cancel`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Booking cancelled successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to cancel booking');
          }
        }),
        catchError(this.handleError)
      );
  }

  getUserBookings(page: number = 1, limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get(`${this.api}/bookings/my-bookings`, {
        headers: this.getAuthHeaders(),
        params,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Bookings retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to retrieve bookings');
          }
        }),
        catchError(this.handleError)
      );
  }

  getBookingById(bookingId: string): Observable<any> {
    return this.http
      .get(`${this.api}/bookings/${bookingId}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Booking retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Booking not found');
          }
        }),
        catchError(this.handleError)
      );
  }

  getBookingStats(): Observable<any> {
    return this.http
      .get(`${this.api}/bookings/stats`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Booking stats retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to retrieve booking stats');
          }
        }),
        catchError(this.handleError)
      );
  }

  getEventBookings(
    eventId: string,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http
      .get(`${this.api}/bookings/event/${eventId}`, {
        headers: this.getAuthHeaders(),
        params,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Event bookings retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to retrieve event bookings');
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
