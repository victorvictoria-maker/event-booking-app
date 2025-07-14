import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingsComponent } from './admin-bookings.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('AdminBookingsComponent', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminBookingsComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
