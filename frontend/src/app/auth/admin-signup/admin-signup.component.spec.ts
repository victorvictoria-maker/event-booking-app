import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignupComponent } from './admin-signup.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('AdminSignupComponent', () => {
  let component: AdminSignupComponent;
  let fixture: ComponentFixture<AdminSignupComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);
    await TestBed.configureTestingModule({
      imports: [AdminSignupComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
