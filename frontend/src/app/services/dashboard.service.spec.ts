import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { AdminDashboardService } from './dashboard.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import {
  mockUserDashboardData,
  mockAdminDashboardData,
  mockRevenueStatsData,
  mockBookingAnalyticsData,
  mockTopUsers,
} from '../test/mock-data';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      providers: [
        AdminDashboardService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authSpy },
      ],
    });

    service = TestBed.inject(AdminDashboardService);
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

      service.getUserDashboard().subscribe();

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/user`
      );
      expect(req.request.headers.get('Authorization')).toBe('Bearer fg56789');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush({ status: 'SUCCESS', data: mockUserDashboardData });
    });
  });

  describe('getUserDashboard', () => {
    it('should get user dashboard successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockUserDashboardData,
        message: 'User dashboard retrieved successfully',
      };

      service.getUserDashboard().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockUserDashboardData,
          message: 'User dashboard retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/user`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch user dashboard',
      };

      service.getUserDashboard().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch user dashboard');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/user`
      );
      req.flush(mockResponse);
    });
  });

  describe('getAdminDashboard', () => {
    it('should get admin dashboard successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockAdminDashboardData,
        message: 'Admin dashboard retrieved successfully',
      };

      service.getAdminDashboard().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockAdminDashboardData,
          message: 'Admin dashboard retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch admin dashboard',
      };

      service.getAdminDashboard().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch admin dashboard');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin`
      );
      req.flush(mockResponse);
    });
  });

  describe('getAdminRevenueStats', () => {
    it('should get revenue stats successfully without parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockRevenueStatsData,
        message: 'Revenue statistics retrieved successfully',
      };

      service.getAdminRevenueStats().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockRevenueStatsData,
          message: 'Revenue statistics retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/revenue`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should get revenue stats with parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockRevenueStatsData,
      };

      const params = {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      };

      service.getAdminRevenueStats(params).subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockRevenueStatsData,
          message: 'Revenue statistics retrieved successfully',
        });
      });

      const expectedUrl = `${environment.apiBaseUrl}/dashboard/admin/revenue?startDate=2025-01-01&endDate=2025-01-31`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should get revenue stats with some parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockRevenueStatsData,
      };

      const params = {
        startDate: '2025-01-01',
      };

      service.getAdminRevenueStats(params).subscribe();

      const expectedUrl = `${environment.apiBaseUrl}/dashboard/admin/revenue?startDate=2025-01-01`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch revenue statistics',
      };

      service.getAdminRevenueStats().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch revenue statistics');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/revenue`
      );
      req.flush(mockResponse);
    });
  });

  describe('getAdminBookingAnalytics', () => {
    it('should get booking analytics successfully without parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockBookingAnalyticsData,
        message: 'Booking analytics retrieved successfully',
      };

      service.getAdminBookingAnalytics().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockBookingAnalyticsData,
          message: 'Booking analytics retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/bookings-analytics`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should get booking analytics with parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockBookingAnalyticsData,
      };

      const params = {
        startDate: '2025-01-01',
        endDate: '2025-01-31',
      };

      service.getAdminBookingAnalytics(params).subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockBookingAnalyticsData,
          message: 'Booking analytics retrieved successfully',
        });
      });

      const expectedUrl = `${environment.apiBaseUrl}/dashboard/admin/bookings-analytics?startDate=2025-01-01&endDate=2025-01-31`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should get booking analytics with some parameters', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockBookingAnalyticsData,
      };

      const params = {
        endDate: '2025-01-31',
      };

      service.getAdminBookingAnalytics(params).subscribe();

      const expectedUrl = `${environment.apiBaseUrl}/dashboard/admin/bookings-analytics?endDate=2025-01-31`;
      const req = httpMock.expectOne(expectedUrl);
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch booking analytics',
      };

      service.getAdminBookingAnalytics().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch booking analytics');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/bookings-analytics`
      );
      req.flush(mockResponse);
    });
  });

  describe('getAdminTopUsersByBookings', () => {
    it('should get top users successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockTopUsers,
        message: 'Top users retrieved successfully',
      };

      service.getAdminTopUsersByBookings().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockTopUsers,
          message: 'Top users retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/top-users`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(
        'Bearer edghe1Gtyu56'
      );
      req.flush(mockResponse);
    });

    it('should get top users with default message', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: mockTopUsers,
      };

      service.getAdminTopUsersByBookings().subscribe((result) => {
        expect(result).toEqual({
          status: 'SUCCESS',
          data: mockTopUsers,
          message: 'Top users retrieved successfully',
        });
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/top-users`
      );
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Failed to fetch top users',
      };

      service.getAdminTopUsersByBookings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch top users');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/top-users`
      );
      req.flush(mockResponse);
    });

    it('should handle ERROR status with default message', () => {
      const mockResponse = {
        status: 'ERROR',
      };

      service.getAdminTopUsersByBookings().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Failed to fetch top users');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/admin/top-users`
      );
      req.flush(mockResponse);
    });
  });

  describe('handleError', () => {
    it('should handle error with error.error.message', () => {
      service.getUserDashboard().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Custom error from server');
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/user`
      );
      req.flush(
        { message: 'Custom error from server' },
        { status: 400, statusText: 'Bad Request' }
      );
    });

    it('should handle error with error.message', () => {
      service.getUserDashboard().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe(
            'Http failure response for ' +
              environment.apiBaseUrl +
              '/dashboard/user: 500 Internal Server Error'
          );
        },
      });

      const req = httpMock.expectOne(
        `${environment.apiBaseUrl}/dashboard/user`
      );
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
