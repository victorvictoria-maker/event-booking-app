import { inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, Observable, throwError, of, delay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Event, EventFilters, EventStats } from '../models/event.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  http = inject(HttpClient);
  private api = environment.apiBaseUrl;
  auth = inject(AuthService);

  getAllEvents(
    filters?: EventFilters,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (filters) {
      if (filters.searchTerm) {
        params = params.set('search', filters.searchTerm);
      }
      if (filters.category) {
        params = params.set('category', filters.category.toLowerCase());
      }
      if (filters.status) {
        params = params.set('status', filters.status);
      }
      if (filters.priceFilter) {
        params = params.set('priceFilter', filters.priceFilter);
      }
    }

    return this.http
      .get(`${this.api}/event`, {
        headers: this.auth.getAuthHeaders(),
        params,
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            // console.log(res.data);
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Events retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to fetch events');
          }
        }),
        catchError(this.handleError)
      );
  }

  getEventById(eventId: string): Observable<any> {
    return this.http
      .get(`${this.api}/event/${eventId}`, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Event retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Event not found');
          }
        }),
        catchError(this.handleError)
      );
  }

  createEvent(eventData: Event): Observable<any> {
    const data = {
      name: eventData.name,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      totalSeats: eventData.totalSeats,
      category: eventData.category?.toLowerCase(),
      venue: eventData.venue,
      price: eventData.isFree ? 0 : eventData.price || 0,
    };

    return this.http
      .post(`${this.api}/event/create`, data, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'CREATED') {
            return {
              status: 'CREATED',
              data: res.data,
              message: res.message || 'Event created successfully',
            };
          } else if (res.status === 'ERROR') {
            throw new Error(res.message);
          } else {
            throw new Error(res.message || 'Failed to create event');
          }
        }),
        catchError(this.handleError)
      );
  }

  updateEvent(eventData: Event): Observable<any> {
    const eventId = eventData.id;

    const data = {
      _id: eventData._id,
      name: eventData.name,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      totalSeats: eventData.totalSeats,
      category: eventData.category?.toLowerCase(),
      venue: eventData.venue,
      price: eventData.isFree ? 0 : eventData.price || 0,
    };

    return this.http
      .put(`${this.api}/event/${eventId}`, data, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Event updated successfully',
            };
          } else if (res.status === 'ERROR') {
            throw new Error(res.message);
          } else {
            throw new Error(res.message || 'Failed to update event');
          }
        }),
        catchError(this.handleError)
      );
  }

  deleteEvent(eventId: string): Observable<any> {
    return this.http
      .delete(`${this.api}/event/${eventId}`, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              message: res.message || 'Event deleted successfully',
            };
          } else if (res.status === 'ERROR') {
            throw new Error(res.message);
          } else {
            throw new Error(res.message || 'Failed to delete event');
          }
        }),
        catchError(this.handleError)
      );
  }

  toggleEventStatus(eventId: string): Observable<any> {
    return this.http
      .patch(
        `${this.api}/event/${eventId}/toggle-status`,
        {},
        {
          headers: this.auth.getAuthHeaders(),
        }
      )
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Event status updated successfully',
            };
          } else if (res.status === 'ERROR') {
            throw new Error(res.message);
          } else {
            throw new Error(res.message || 'Failed to update event status');
          }
        }),
        catchError(this.handleError)
      );
  }

  getEventStats(): Observable<any> {
    return this.http
      .get(`${this.api}/event/stats`, {
        headers: this.auth.getAuthHeaders(),
      })
      .pipe(
        map((res: any) => {
          if (res.status === 'SUCCESS') {
            return {
              status: 'SUCCESS',
              data: res.data,
              message: res.message || 'Event statistics retrieved successfully',
            };
          } else {
            throw new Error(res.message || 'Failed to fetch event statistics');
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
