import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EventService } from './event.service';
import { AuthService } from './auth.service';
import { Event, EventFilters } from '../models/event.model';
import { environment } from '../../environments/environment';
import { mockEvent, mockEventFilters } from '../test/mock-data';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'getToken',
      'getAuthHeaders',
    ]);

    TestBed.configureTestingModule({
      providers: [
        EventService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    authServiceSpy.getToken.and.returnValue('edghe1Gtyu56');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAllEvents', () => {
    it('should fetch all events successfully with default parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockEvent],
        message: 'Events retrieved successfully',
      };

      service.getAllEvents().subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.data).toEqual([mockEvent]);
        expect(res.message).toBe('Events retrieved successfully');
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event?page=1&limit=10`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch events when filters are applied', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockEvent],
        message: 'Events retrieved successfully',
      };

      service.getAllEvents(mockEventFilters, 2, 20).subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.data).toEqual([mockEvent]);
      });

      const expectedUrl = `${environment.apiBaseUrl}/event?page=2&limit=20&search=music&category=music&status=active&priceFilter=paid`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should fetch events with some filters, not all filter', () => {
      const partialFilters: EventFilters = {
        searchTerm: 'concert',
        category: 'Entertainment',
        status: '',
        priceFilter: '',
      };

      const mockResponse = {
        status: 'SUCCESS',
        data: [mockEvent],
      };

      service.getAllEvents(partialFilters, 1, 10).subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
      });

      const expectedUrl = `${environment.apiBaseUrl}/event?page=1&limit=10&search=concert&category=entertainment`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should handle failed fetched events', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch events',
      };

      service.getAllEvents().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch events');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event?page=1&limit=10`
      );
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unknown event error',
      };

      service.getAllEvents().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unknown event error');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event?page=1&limit=10`
      );
      req.flush(mockResponse);
    });
  });

  describe('getEventById', () => {
    it('should fetch single event successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockEvent,
        message: 'Event retrieved successfully',
      };

      service.getEventById('1').subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.data).toEqual(mockEvent);
        expect(res.message).toBe('Event retrieved successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Event not found',
      };

      service.getEventById('999').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Event not found');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/999`);
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unexpected status',
      };

      service.getEventById('1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unexpected status');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      req.flush(mockResponse);
    });
  });

  describe('createEvent', () => {
    it('should create event successfully', () => {
      const mockResponse = {
        status: 'CREATED',
        data: mockEvent,
        message: 'Event created successfully',
      };

      service.createEvent(mockEvent).subscribe((res) => {
        expect(res.status).toBe('CREATED');
        expect(res.data).toEqual(mockEvent);
        expect(res.message).toBe('Event created successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        name: 'Farming Festival',
        description: 'Test Description',
        date: '2025-07-01',
        time: '10:00 - 12:00',
        totalSeats: 100,
        category: 'music',
        venue: 'Abuja',
        price: 50,
      });
      req.flush(mockResponse);
    });

    it('should create free event successfully', () => {
      const freeEvent = { ...mockEvent, isFree: true, price: 0 };
      const mockResponse = {
        status: 'CREATED',
        data: freeEvent,
        message: 'Event created successfully',
      };

      service.createEvent(freeEvent).subscribe((res) => {
        expect(res.status).toBe('CREATED');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      expect(req.request.body.price).toBe(0);
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to create event',
      };

      service.createEvent(mockEvent).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to create event');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unexpected response',
      };

      service.createEvent(mockEvent).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unexpected response');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      req.flush(mockResponse);
    });

    it('should default price to 0 when isFree is false and price is falsy', () => {
      const freeEvent = {
        ...mockEvent,
        isFree: false,
        price: undefined,
      } as unknown as Event;
      const mockResponse = {
        status: 'CREATED',
        data: { ...freeEvent, price: 0 },
        message: 'Event created successfully',
      };

      service.createEvent(freeEvent).subscribe((res) => {
        expect(res.data.price).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      expect(req.request.body.price).toBe(0);
      req.flush(mockResponse);
    });

    it('should fallback to default message if res.message is missing', () => {
      const mockResponse = {
        status: 'CREATED',
        data: mockEvent,
      };

      service.createEvent(mockEvent).subscribe((res) => {
        expect(res.message).toBe('Event created successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      req.flush(mockResponse);
    });

    it('should throw default error message when res.message is missing', () => {
      const mockResponse = {
        status: 'ERROR',
      };

      service.createEvent(mockEvent).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('An error occurred');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/create`);
      req.flush(mockResponse);
    });
  });

  describe('updateEvent', () => {
    it('should update event successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockEvent,
        message: 'Event updated successfully',
      };

      service.updateEvent(mockEvent).subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.data).toEqual(mockEvent);
        expect(res.message).toBe('Event updated successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({
        _id: '1',
        name: 'Farming Festival',
        description: 'Test Description',
        date: '2025-07-01',
        time: '10:00 - 12:00',
        totalSeats: 100,
        category: 'music',
        venue: 'Abuja',
        price: 50,
      });
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to update event',
      };

      service.updateEvent(mockEvent).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to update event');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unexpected response',
      };

      service.updateEvent(mockEvent).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unexpected response');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      req.flush(mockResponse);
    });

    it('should default price to 0 when updating and price is falsy', () => {
      const freeEvent = {
        ...mockEvent,
        isFree: false,
        price: undefined,
      } as unknown as Event;
      const mockResponse = {
        status: 'SUCCESS',
        data: { ...freeEvent, price: 0 },
        message: 'Event updated successfully',
      };

      service.updateEvent(freeEvent).subscribe((res) => {
        expect(res.data.price).toBe(0);
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      expect(req.request.body.price).toBe(0);
      req.flush(mockResponse);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        message: 'Event deleted successfully',
      };

      service.deleteEvent('1').subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.message).toBe('Event deleted successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to delete event',
      };

      service.deleteEvent('1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to delete event');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unexpected response',
      };

      service.deleteEvent('1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unexpected response');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/1`);
      req.flush(mockResponse);
    });
  });

  describe('toggleEventStatus', () => {
    it('should toggle event status successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockEvent,
        message: 'Event status updated successfully',
      };

      service.toggleEventStatus('1').subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.data).toEqual(mockEvent);
        expect(res.message).toBe('Event status updated successfully');
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event/1/toggle-status`
      );
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({});
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to update event status',
      };

      service.toggleEventStatus('1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to update event status');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event/1/toggle-status`
      );
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unexpected response',
      };

      service.toggleEventStatus('1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unexpected response');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event/1/toggle-status`
      );
      req.flush(mockResponse);
    });
  });

  describe('getEventStats', () => {
    it('should get event stats successfully', () => {
      const mockStats = {
        totalEvents: 10,
        activeEvents: 8,
        cancelledEvents: 2,
        completedEvents: 0,
      };

      const mockResponse = {
        status: 'SUCCESS',
        data: mockStats,
        message: 'Event statistics retrieved successfully',
      };

      service.getEventStats().subscribe((res) => {
        expect(res.status).toBe('SUCCESS');
        expect(res.data).toEqual(mockStats);
        expect(res.message).toBe('Event statistics retrieved successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/stats`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should handle error status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch event statistics',
      };

      service.getEventStats().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch event statistics');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/stats`);
      req.flush(mockResponse);
    });

    it('should handle unexpected status response', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        message: 'Unexpected stats response',
      };

      service.getEventStats().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unexpected stats response');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/event/stats`);
      req.flush(mockResponse);
    });
  });

  describe('handleError', () => {
    it('should handle error with error.error.message', () => {
      service.getAllEvents().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Custom error from server');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event?page=1&limit=10`
      );
      req.flush(
        { message: 'Custom error from server' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle error with error.message', () => {
      service.getAllEvents().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe(
            'Http failure response for ' +
              environment.apiBaseUrl +
              '/event?page=1&limit=10: 500 Internal Server Error'
          );
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/event?page=1&limit=10`
      );
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
