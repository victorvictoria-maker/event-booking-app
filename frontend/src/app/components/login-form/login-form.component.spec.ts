import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div>A component</div>',
})
class MockComponent {}

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([
          { path: 'login', component: MockComponent },
          { path: 'events', component: MockComponent },
          { path: 'admin/login', component: MockComponent },
          { path: 'admin/dashboard', component: MockComponent },
          { path: 'bookings', component: MockComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    router.navigate(['/login'], { queryParams: { returnUrl: '/return-url' } });

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values and validators', () => {
    expect(component.loginForm.get('usernameOrEmail')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(
      component.loginForm.get('usernameOrEmail')?.hasError('required')
    ).toBe(true);
    expect(component.loginForm.get('password')?.hasError('required')).toBe(
      true
    );
  });

  it('should have component title', () => {
    expect(component.title).toBe('Welcome Back');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);

    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);

    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should call togglePasswordVisibility when password visibility button is clicked', () => {
    spyOn(component, 'togglePasswordVisibility');

    component.loginForm.patchValue({
      usernameOrEmail: 'vicky',
      password: 'password123',
    });

    fixture.detectChanges();

    const passwordToggleButton = fixture.debugElement.query(
      By.css('.password-toggle-btn')
    );
    if (passwordToggleButton) {
      passwordToggleButton.nativeElement.click();
      expect(component.togglePasswordVisibility).toHaveBeenCalled();
    }
  });

  it('should get the returnUrl from query params', () => {
    expect(component['returnUrl']).toBe('/return-url');
  });

  describe('ngOnInit', () => {
    let freshComponent: LoginFormComponent;
    let freshFixture: ComponentFixture<LoginFormComponent>;

    it('should redirect admin to dashboard when there is token and current URL is admin login', async () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'event-booking-app-token') return '"ertfgyh4567"';
        if (key === 'event-booking-is-admin') return 'true';
        return null;
      });

      await router.navigate(['/admin/login']);

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(LoginFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('should redirect regular user to events page when token exists and current URL is login', async () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'event-booking-app-token') return '"ertfgyh4567"';
        if (key === 'event-booking-is-admin') return 'false';
        return null;
      });

      await router.navigate(['/login']);

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(LoginFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith('/events');
    });

    it('should not redirect when there is no token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(LoginFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not redirect to admin when not on admin login page', async () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'event-booking-app-token') return '"ertfgyh4567"';
        if (key === 'event-booking-is-admin') return 'true';
        return null;
      });

      await router.navigate(['/events']);

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(LoginFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it('should not redirect regular user when not on login page', async () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'event-booking-app-token') return '"ertfgyh4567"';
        if (key === 'event-booking-is-admin') return 'false';
        return null;
      });

      await router.navigate(['/bookings']);

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(LoginFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should not submit when form is invalid', () => {
      component.loginForm.patchValue({
        usernameOrEmail: '',
        password: '',
      });

      component.onSubmit();

      expect(mockAuthService.login).not.toHaveBeenCalled();
      expect(component.loginForm.get('usernameOrEmail')?.touched).toBe(true);
      expect(component.loginForm.get('password')?.touched).toBe(true);
    });

    it('should submit when form is valid and handle successful login', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        isAdmin: false,
      };

      mockAuthService.login.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component.loginForm.patchValue({
        usernameOrEmail: 'vicky',
        password: 'password123',
      });

      component.onSubmit();

      expect(mockAuthService.login).toHaveBeenCalledWith(
        'vicky',
        'password123'
      );

      tick();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.loginForm.get('usernameOrEmail')?.value).toBe(null);
      expect(component.loginForm.get('password')?.value).toBe(null);
    }));

    it('should navigate to admin dashboard for admin user', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        isAdmin: true,
      };

      mockAuthService.login.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component['returnUrl'] = null;

      component.loginForm.patchValue({
        usernameOrEmail: 'adminvicky',
        password: 'password123',
      });

      component.onSubmit();

      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith('admin/dashboard');
    }));

    it('should navigate to returnUrl when provided', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        isAdmin: false,
      };

      mockAuthService.login.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component['returnUrl'] = '/custom-return-url';

      component.loginForm.patchValue({
        usernameOrEmail: 'vicky',
        password: 'password123',
      });

      component.onSubmit();

      tick();

      expect(router.navigateByUrl).toHaveBeenCalledWith('/custom-return-url');
    }));

    it('should handle login error', fakeAsync(() => {
      const mockError = new Error('Invalid credentials');
      mockAuthService.login.and.returnValue(throwError(() => mockError));

      component.loginForm.patchValue({
        usernameOrEmail: 'rose',
        password: '124747345',
      });

      component.onSubmit();

      tick();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Login failed:',
        'Invalid credentials'
      );
    }));

    it('should reset form after successful login', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Login successful',
        isAdmin: false,
      };

      mockAuthService.login.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component.loginForm.patchValue({
        usernameOrEmail: 'vicky',
        password: 'password123',
      });

      component.onSubmit();

      tick();
      fixture.detectChanges();

      expect(component.loginForm.get('usernameOrEmail')?.value).toBe(null);
      expect(component.loginForm.get('password')?.value).toBe(null);
    }));

    it('should call onSubmit method when form is submitted', () => {
      spyOn(component, 'onSubmit');

      const form = fixture.debugElement.query(By.css('form'));
      if (form) {
        form.nativeElement.dispatchEvent(new Event('submit'));
        expect(component.onSubmit).toHaveBeenCalled();
      }
    });
  });

  describe('Form Validation', () => {
    it('should show required error for empty username', () => {
      const usernameControl = component.loginForm.get('usernameOrEmail');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      expect(usernameControl?.hasError('required')).toBe(true);
    });

    it('should show required error for empty password', () => {
      const passwordControl = component.loginForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should be valid when both fields are filled', () => {
      component.loginForm.patchValue({
        usernameOrEmail: 'vicky',
        password: 'password123',
      });

      expect(component.loginForm.valid).toBe(true);
    });
  });
});
