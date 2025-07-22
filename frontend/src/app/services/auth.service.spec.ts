import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { mockUser } from '../test/mock-data';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('storeAuthData', () => {
    it('should store auth data in localStorage', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: {
          token: 'tgf678uhj',
          user: {
            username: 'vicky',
            isAdmin: true,
          },
        },
      };

      service.login('vicky', 'password123').subscribe();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signin`);
      req.flush(mockResponse);

      expect(localStorage.getItem('event-booking-app-token')).toBe(
        '"tgf678uhj"'
      );
      expect(localStorage.getItem('event-booking-is-admin')).toBe('true');
      expect(localStorage.getItem('event-booking-app-username')).toBe(
        '"vicky"'
      );
    });
  });

  describe('getAuthHeaders', () => {
    it('should create headers with token when token exists', () => {
      const mockToken = 'fg56789';
      spyOn(service, 'getToken').and.returnValue(mockToken);

      const headers = service.getAuthHeaders();

      expect(headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should create headers with null token when no token exists', () => {
      spyOn(service, 'getToken').and.returnValue(null);

      const headers = service.getAuthHeaders();

      expect(headers.get('Authorization')).toBe('Bearer null');
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('should create headers with proper content type', () => {
      spyOn(service, 'getToken').and.returnValue('fg56789');

      const headers = service.getAuthHeaders();

      expect(headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('register', () => {
    it('should register user successfully and store auth data', () => {
      const mockResponse = {
        status: 'CREATED',
        data: {
          token: '123456789',
          user: {
            username: 'vicky',
            isAdmin: false,
          },
        },
      };

      service.register(mockUser).subscribe((result) => {
        expect(result).toEqual({
          success: true,
          message: 'Registration successful',
          isAdmin: false,
        });
        expect(localStorage.getItem('event-booking-app-token')).toBe(
          '"123456789"'
        );
        expect(localStorage.getItem('event-booking-is-admin')).toBe('false');
        expect(localStorage.getItem('event-booking-app-username')).toBe(
          '"vicky"'
        );
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signup`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        username: 'vicky',
        email: 'vee@gmail.com',
        password: 'password123',
        isAdmin: false,
      });
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Registration failed',
      };

      service.register(mockUser).subscribe({
        next: () => fail('registration should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Registration failed');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signup`);
      req.flush(mockResponse);
    });

    it('should handle HTTP error response without error message', () => {
      service.register(mockUser).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.message).toBe('Registration failed. Please try again.');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signup`);
      req.flush({}, { status: 500, statusText: 'Internal Server Error' });
    });

    it('should throw default error on unexpected status in register', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        data: {
          message: 'Registration failed. Please try again.',
        },
      };

      service.register(mockUser).subscribe({
        next: () => fail('registration should have failed'),
        error: (error) => {
          expect(error.message).toBe('Registration failed. Please try again.');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signup`);
      req.flush(mockResponse);
    });

    it('should register admin user successfully', () => {
      const adminUser = { ...mockUser, isAdmin: true };
      const mockResponse = {
        status: 'CREATED',
        data: {
          token: 'admin-token',
          user: {
            username: 'adminvicky',
            isAdmin: true,
          },
        },
      };

      service.register(adminUser).subscribe((result) => {
        expect(result.isAdmin).toBe(true);
        expect(localStorage.getItem('event-booking-is-admin')).toBe('true');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signup`);
      req.flush(mockResponse);
    });
  });

  describe('login', () => {
    it('should login user successfully and store auth data', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: {
          token: '123456789',
          user: {
            username: 'vicky',
            isAdmin: false,
          },
        },
      };

      service.login('vicky', 'password123').subscribe((result) => {
        expect(result).toEqual({
          success: true,
          message: 'Login successful',
          isAdmin: false,
        });
        expect(localStorage.getItem('event-booking-app-token')).toBe(
          '"123456789"'
        );
        expect(localStorage.getItem('event-booking-is-admin')).toBe('false');
        expect(localStorage.getItem('event-booking-app-username')).toBe(
          '"vicky"'
        );
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signin`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        identifier: 'vicky',
        password: 'password123',
      });
      req.flush(mockResponse);
    });

    it('should handle ERROR status response', () => {
      const mockResponse = {
        status: 'ERROR',
        message: 'Login failed. Please try again.',
      };

      service.login('vee', '345').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toContain('Login failed. Please try again.');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signin`);
      req.flush(mockResponse);
    });

    it('should throw default error on unexpected status in login', () => {
      const mockResponse = {
        status: 'UNKNOWN',
        data: {
          message: 'Login failed. Please try again.',
        },
      };

      service.login('vee', '12345').subscribe({
        next: () => fail('login should have failed'),
        error: (error) => {
          expect(error.message).toBe('Login failed. Please try again.');
        },
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signin`);
      req.flush(mockResponse);
    });

    it('should login admin user successfully', () => {
      const mockResponse = {
        status: 'SUCCESS',
        data: {
          token: '123456789',
          user: {
            username: 'adminvee',
            isAdmin: true,
          },
        },
      };

      service.login('adminvee', '123456789').subscribe((result) => {
        expect(result.isAdmin).toBe(true);
        expect(localStorage.getItem('event-booking-is-admin')).toBe('true');
      });

      const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/signin`);
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      localStorage.setItem('event-booking-app-token', '"1234567"');
      localStorage.setItem('event-booking-is-admin', 'false');
      localStorage.setItem('event-booking-app-username', '"vee"');

      service.logout();

      expect(localStorage.getItem('event-booking-app-token')).toBeNull();
      expect(localStorage.getItem('event-booking-is-admin')).toBeNull();
      expect(localStorage.getItem('event-booking-app-username')).toBeNull();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('login');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('event-booking-app-token', '"3r3tt3"');

      const token = service.getToken();

      expect(token).toBe('3r3tt3');
    });

    it('should return null when no token in localStorage', () => {
      const token = service.getToken();

      expect(token).toBeNull();
    });
  });

  describe('isAdmin', () => {
    it('should return true when user is admin', () => {
      localStorage.setItem('event-booking-is-admin', 'true');

      const isAdmin = service.isAdmin();

      expect(isAdmin).toBe(true);
    });

    it('should return false when user is not admin', () => {
      localStorage.setItem('event-booking-is-admin', 'false');

      const isAdmin = service.isAdmin();

      expect(isAdmin).toBe(false);
    });
  });

  describe('getUsername', () => {
    it('should return username from localStorage', () => {
      localStorage.setItem('event-booking-app-username', '"vicky"');

      const username = service.getUsername();

      expect(username).toBe('vicky');
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('event-booking-app-token', '"etege7676"');

      const isLoggedIn = service.isLoggedIn();

      expect(isLoggedIn).toBe(true);
    });

    it('should return false when no token exists', () => {
      const isLoggedIn = service.isLoggedIn();

      expect(isLoggedIn).toBe(false);
    });

    it('should return false when token is empty string', () => {
      localStorage.setItem('event-booking-app-token', '""');

      const isLoggedIn = service.isLoggedIn();

      expect(isLoggedIn).toBe(false);
    });
  });
});
