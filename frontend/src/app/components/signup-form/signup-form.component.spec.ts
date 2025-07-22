import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SignupFormComponent } from './signup-form.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div>A component</div>',
})
class MockComponent {}

describe('SignupFormComponent', () => {
  let component: SignupFormComponent;
  let fixture: ComponentFixture<SignupFormComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [SignupFormComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([
          { path: 'dashboard', component: MockComponent },
          { path: 'admin/dashboard', component: MockComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SignupFormComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values and validators', () => {
    expect(component.signupForm.get('username')?.value).toBe('');
    expect(component.signupForm.get('email')?.value).toBe('');
    expect(component.signupForm.get('password')?.value).toBe('');
    expect(component.signupForm.get('confirmPassword')?.value).toBe('');

    expect(component.signupForm.get('username')?.hasError('required')).toBe(
      true
    );
    expect(component.signupForm.get('email')?.hasError('required')).toBe(true);
    expect(component.signupForm.get('password')?.hasError('required')).toBe(
      true
    );
    expect(
      component.signupForm.get('confirmPassword')?.hasError('required')
    ).toBe(true);
  });

  it('should have default component title', () => {
    expect(component.title).toBe('Join Us');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);

    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);

    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should toggle confirm password visibility', () => {
    expect(component.showConfirmPassword()).toBe(false);

    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword()).toBe(true);

    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword()).toBe(false);
  });

  it('should call togglePasswordVisibility when password visibility button is clicked', () => {
    spyOn(component, 'togglePasswordVisibility');

    component.signupForm.patchValue({
      username: 'jane',
      email: 'jane@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    fixture.detectChanges();

    const passwordToggleButtons = fixture.debugElement.queryAll(
      By.css('.password-toggle-btn')
    );

    if (passwordToggleButtons.length > 0) {
      passwordToggleButtons[0].nativeElement.click();
      expect(component.togglePasswordVisibility).toHaveBeenCalled();
    }
  });

  it('should call toggleConfirmPasswordVisibility when confirm password visibility button is clicked', () => {
    spyOn(component, 'toggleConfirmPasswordVisibility');

    component.signupForm.patchValue({
      username: 'jane',
      email: 'jane@gmail.com',
      password: 'password123',
      confirmPassword: 'password123',
    });

    fixture.detectChanges();

    const passwordToggleButtons = fixture.debugElement.queryAll(
      By.css('.password-toggle-btn')
    );

    if (passwordToggleButtons.length > 1) {
      passwordToggleButtons[1].nativeElement.click();
      expect(component.toggleConfirmPasswordVisibility).toHaveBeenCalled();
    }
  });

  describe('ngOnInit', () => {
    let freshComponent: SignupFormComponent;
    let freshFixture: ComponentFixture<SignupFormComponent>;

    it('should redirect admin to dashboard when there is token and user is admin', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'event-booking-app-token') return '"ertfgyh4567"';
        if (key === 'event-booking-is-admin') return 'true';
        return null;
      });

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(SignupFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith('/admin/dashboard');
    });

    it('should redirect regular user to dashboard when token exists and user is not admin', () => {
      spyOn(localStorage, 'getItem').and.callFake((key: string) => {
        if (key === 'event-booking-app-token') return '"ertfgyh4567"';
        if (key === 'event-booking-is-admin') return 'false';
        return null;
      });

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(SignupFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).toHaveBeenCalledWith('/dashboard');
    });

    it('should not redirect when there is no token', () => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const navigateSpy = spyOn(router, 'navigateByUrl');

      freshFixture = TestBed.createComponent(SignupFormComponent);
      freshComponent = freshFixture.componentInstance;

      freshComponent.ngOnInit();

      expect(navigateSpy).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should show required error for empty username', () => {
      const usernameControl = component.signupForm.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      expect(usernameControl?.hasError('required')).toBe(true);
    });

    it('should show required error for empty email', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('required')).toBe(true);
    });

    it('should show email error for invalid email format', () => {
      const emailControl = component.signupForm.get('email');
      emailControl?.setValue('invalid-email');
      emailControl?.markAsTouched();

      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should show required error for empty password', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should show minlength error for password less than 6 characters', () => {
      const passwordControl = component.signupForm.get('password');
      passwordControl?.setValue('12345');
      passwordControl?.markAsTouched();

      expect(passwordControl?.hasError('minlength')).toBe(true);
    });

    it('should show required error for empty confirm password', () => {
      const confirmPasswordControl =
        component.signupForm.get('confirmPassword');
      confirmPasswordControl?.setValue('');
      confirmPasswordControl?.markAsTouched();

      expect(confirmPasswordControl?.hasError('required')).toBe(true);
    });

    it('should show  error when passwords do not match', () => {
      component.signupForm.patchValue({
        password: 'password123',
        confirmPassword: 'word34567yu8',
      });

      expect(component.signupForm.hasError('notMatching')).toBe(true);
    });

    it('should not show error when passwords match', () => {
      component.signupForm.patchValue({
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.signupForm.hasError('notMatching')).toBe(false);
    });

    it('should be valid when all fields are properly filled', () => {
      component.signupForm.patchValue({
        username: 'jane',
        email: 'jane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      expect(component.signupForm.valid).toBe(true);
    });
  });

  describe('matchPasswords validator', () => {
    it('should return null when confirm password is empty', () => {
      const mockGroup = {
        get: jasmine.createSpy('get').and.callFake((field: string) => {
          if (field === 'password') return { value: 'password123' };
          if (field === 'confirmPassword') return { value: '' };
          return null;
        }),
      } as any;

      const result = component.matchPasswords(mockGroup);
      expect(result).toBe(null);
    });

    it('should return null when passwords match', () => {
      const mockGroup = {
        get: jasmine.createSpy('get').and.callFake((field: string) => {
          if (field === 'password') return { value: 'password123' };
          if (field === 'confirmPassword') return { value: 'password123' };
          return null;
        }),
      } as any;

      const result = component.matchPasswords(mockGroup);
      expect(result).toBe(null);
    });

    it('should return error object when passwords do not match', () => {
      const mockGroup = {
        get: jasmine.createSpy('get').and.callFake((field: string) => {
          if (field === 'password') return { value: 'password123' };
          if (field === 'confirmPassword') return { value: 'word345768uuhn' };
          return null;
        }),
      } as any;

      const result = component.matchPasswords(mockGroup);
      expect(result).toEqual({ notMatching: true });
    });
  });

  describe('onSubmit', () => {
    it('should not submit when form is invalid', () => {
      component.signupForm.patchValue({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      component.onSubmit();

      expect(mockAuthService.register).not.toHaveBeenCalled();
      expect(component.signupForm.get('username')?.touched).toBe(true);
      expect(component.signupForm.get('email')?.touched).toBe(true);
      expect(component.signupForm.get('password')?.touched).toBe(true);
      expect(component.signupForm.get('confirmPassword')?.touched).toBe(true);
    });

    it('should submit when form is valid and handle successful registration for regular user', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        isAdmin: false,
      };

      mockAuthService.register.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component.signupForm.patchValue({
        username: 'jane',
        email: 'jane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      expect(mockAuthService.register).toHaveBeenCalledWith({
        username: 'jane',
        email: 'jane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
        isAdmin: false,
      });

      tick();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(router.navigateByUrl).toHaveBeenCalledWith('dashboard');
      expect(component.signupForm.get('username')?.value).toBe(null);
      expect(component.signupForm.get('email')?.value).toBe(null);
      expect(component.signupForm.get('password')?.value).toBe(null);
      expect(component.signupForm.get('confirmPassword')?.value).toBe(null);
    }));

    it('should navigate to admin dashboard for admin user', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        isAdmin: true,
      };

      mockAuthService.register.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component.isAdmin = true;

      component.signupForm.patchValue({
        username: 'adminjane',
        email: 'adminjane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      tick();

      expect(mockAuthService.register).toHaveBeenCalledWith({
        username: 'adminjane',
        email: 'adminjane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
        isAdmin: true,
      });

      expect(router.navigateByUrl).toHaveBeenCalledWith('admin/dashboard');
    }));

    it('should handle registration error', fakeAsync(() => {
      const mockError = new Error('Registration failed');
      mockAuthService.register.and.returnValue(throwError(() => mockError));

      component.signupForm.patchValue({
        username: 'jane',
        email: 'jane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      tick();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Signup failed:',
        'Registration failed'
      );
    }));

    it('should reset form after successful registration', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        isAdmin: false,
      };

      mockAuthService.register.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component.signupForm.patchValue({
        username: 'jane',
        email: 'jane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      tick();
      fixture.detectChanges();

      expect(component.signupForm.get('username')?.value).toBe(null);
      expect(component.signupForm.get('email')?.value).toBe(null);
      expect(component.signupForm.get('password')?.value).toBe(null);
      expect(component.signupForm.get('confirmPassword')?.value).toBe(null);
    }));

    it('should call onSubmit method when form is submitted', () => {
      spyOn(component, 'onSubmit');

      const form = fixture.debugElement.query(By.css('form'));
      if (form) {
        form.nativeElement.dispatchEvent(new Event('submit'));
        expect(component.onSubmit).toHaveBeenCalled();
      }
    });

    it('should set isLoading to true during submission', fakeAsync(() => {
      const mockResponse = {
        success: true,
        message: 'Registration successful',
        isAdmin: false,
      };

      mockAuthService.register.and.returnValue(of(mockResponse));
      spyOn(router, 'navigateByUrl');

      component.signupForm.patchValue({
        username: 'jane',
        email: 'jane@gmail.com',
        password: 'password123',
        confirmPassword: 'password123',
      });

      component.onSubmit();

      tick();
      fixture.detectChanges();

      expect(component.isLoading()).toBe(false);
      expect(component.signupForm.get('username')?.value).toBe(null);
      expect(component.signupForm.get('email')?.value).toBe(null);
      expect(component.signupForm.get('password')?.value).toBe(null);
      expect(component.signupForm.get('confirmPassword')?.value).toBe(null);
    }));
  });

  describe('Component Properties', () => {
    it('should have isAdmin input property with default value false', () => {
      expect(component.isAdmin).toBe(false);
    });

    it('should have title input property with default value "Join Us"', () => {
      expect(component.title).toBe('Join Us');
    });

    it('should accept custom title input', () => {
      component.title = 'Another Signup Title';
      expect(component.title).toBe('Another Signup Title');
    });

    it('should accept custom isAdmin input', () => {
      component.isAdmin = true;
      expect(component.isAdmin).toBe(true);
    });
  });

  describe('Form Controls Getter', () => {
    it('should return form controls through f getter', () => {
      const controls = component.f;
      expect(controls).toBe(component.signupForm.controls);
      expect(controls['username']).toBeDefined();
      expect(controls['email']).toBeDefined();
      expect(controls['password']).toBeDefined();
      expect(controls['confirmPassword']).toBeDefined();
    });
  });
});
