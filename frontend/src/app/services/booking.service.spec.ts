import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BookingService } from './booking.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { mockBooking, mockBookingStats } from '../test/mock-data';

describe('BookingService', () => {
  let service: BookingService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        BookingService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(BookingService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    authServiceSpy.getToken.and.returnValue('edghe1Gtyu56');
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('getAuthHeaders', () => {
    it('should create headers with token', () => {
      authServiceSpy.getToken.and.returnValue('fg56789');

      service.createBooking('event1').subscribe();

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/create`
      );
      expect(req.request.headers.get('Authorization')).toBe('Bearer fg56789');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({ status: 'CREATED', data: mockBooking });
    });
  });

  describe('createBooking', () => {
    it('should create booking successfully', () => {
      const mockResponse = {
        status: 'CREATED',
        data: mockBooking,
        message: 'Booking created successfully',
      };

      service.createBooking('event1').subscribe((result) => {
        expect(result).toEqual({
          status: 'CREATED',
          data: mockBooking,
          message: 'Booking created successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/create`
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      expect(req.request.body).toEqual({ eventId: 'event1' });
      req.flush(mockResponse);
    });

    it('should handle non-CREATED booking status response with default message', () => {
      const mockResponse = {
        status: 'ERROR',
      };

      service.createBooking('event1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to create booking');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/create`
      );
      req.flush(mockResponse);
    });

    it('should handle HTTP error response', () => {
      service.createBooking('event1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Server error occurred');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/create`
      );
      req.flush(
        { message: 'Server error occurred' },
        { status: 500, statusText: 'Internal Server Error' }
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: { message: 'Booking cancelled' },
        message: 'Booking cancelled successfully',
      };

      service.cancelBooking('booking1').subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: { message: 'Booking cancelled' },
          message: 'Booking cancelled successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1/cancel`
      );
      expect(req.request.method).toBe('DELETE');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should cancel booking successfully with default message', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: { message: 'Booking cancelled' },
      };

      service.cancelBooking('booking1').subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: { message: 'Booking cancelled' },
          message: 'Booking cancelled successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1/cancel`
      );
      req.flush(mockResponse);
    });

    it('should handle booking not found', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Booking not found',
      };

      service.cancelBooking('booking1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Booking not found');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1/cancel`
      );
      req.flush(mockResponse);
    });

    it('should handle error while cancelling booking', () => {
      const mockResponse = {
        status: 'ERROR',
      };

      service.cancelBooking('booking1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to cancel booking');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1/cancel`
      );
      req.flush(mockResponse);
    });
  });

  describe('getUserBookings', () => {
    it('should get user bookings successfully with default parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockBooking],
        message: 'Bookings retrieved successfully',
      };

      service.getUserBookings().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: [mockBooking],
          message: 'Bookings retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/my-bookings?page=1&limit=10`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should get user bookings with all parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockBooking],
        message: 'Bookings retrieved successfully',
      };

      service
        .getUserBookings(2, 20, 'active', 'music', 'entertainment')
        .subscribe((result) => {
          expect(result.status).toBe('SUCCESS');
        });

      const expectedUrl = `${environment.apiBaseUrl}/bookings/my-bookings?page=2&limit=20&status=active&search=music&category=entertainment`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should get user bookings with some parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockBooking],
      };

      service
        .getUserBookings(1, 10, 'active', '', 'music')
        .subscribe((result) => {
          expect(result.status).toBe('SUCCESS');
        });

      const expectedUrl = `${environment.apiBaseUrl}/bookings/my-bookings?page=1&limit=10&status=active&category=music`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should handle booking retrieval failure', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to retrieve bookings',
      };

      service.getUserBookings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to retrieve bookings');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/my-bookings?page=1&limit=10`
      );
      req.flush(mockResponse);
    });

    it('should handle HTTP error response', () => {
      service.getUserBookings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Unauthorized access');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/my-bookings?page=1&limit=10`
      );
      req.flush(
        { message: 'Unauthorized access' },
        { status: 401, statusText: 'Unauthorized' }
      );
    });
  });

  describe('getBookingById', () => {
    it('should get booking by id successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockBooking,
        message: 'Booking retrieved successfully',
      };

      service.getBookingById('booking1').subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockBooking,
          message: 'Booking retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should get booking by id with default message', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockBooking,
      };

      service.getBookingById('booking1').subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockBooking,
          message: 'Booking retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1`
      );
      req.flush(mockResponse);
    });

    it('should handle single booking not found', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Booking not found',
      };

      service.getBookingById('booking1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Booking not found');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/booking1`
      );
      req.flush(mockResponse);
    });
  });

  describe('getBookingStats', () => {
    it('should get booking stats successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockBookingStats,
        message: 'Booking stats retrieved successfully',
      };

      service.getBookingStats().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockBookingStats,
          message: 'Booking stats retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/stats`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should handle failed retrieval of booking statistics', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to retrieve booking stats',
      };

      service.getBookingStats().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to retrieve booking stats');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/stats`
      );
      req.flush(mockResponse);
    });
  });

  describe('getAllBookings', () => {
    it('should get all bookings successfully with default parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockBooking],
        message: 'Event bookings retrieved successfully',
      };

      service.getAllBookings().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: [mockBooking],
          message: 'Event bookings retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings?page=1&limit=10`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should get all bookings with custom parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: [mockBooking],
        message: 'Event bookings retrieved successfully',
      };

      service.getAllBookings(3, 25).subscribe((result) => {
        expect(result.status).toBe('SUCCESS');
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings?page=3&limit=25`
      );
      req.flush(mockResponse);
    });

    it('should handle error when all bookings cannot be found', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to retrieve event bookings',
      };

      service.getAllBookings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to retrieve event bookings');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings?page=1&limit=10`
      );
      req.flush(mockResponse);
    });
  });

  describe('handleError', () => {
    it('should handle error with error.error.message', () => {
      service.createBooking('event1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Custom error from server');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/create`
      );
      req.flush(
        { message: 'Custom error from server' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle error with error.message', () => {
      service.createBooking('event1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe(
            'Http failure response for ' +
              environment.apiBaseUrl +
              '/bookings/create: 500 Internal Server Error'
          );
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/bookings/create`
      );
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
