import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBookingsComponent } from './user-bookings.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('UserBookingsComponent', () => {
  let component: UserBookingsComponent;
  let fixture: ComponentFixture<UserBookingsComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [UserBookingsComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
