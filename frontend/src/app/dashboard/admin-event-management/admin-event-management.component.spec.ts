import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEventManagementComponent } from './admin-event-management.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';

describe('AdminEventManagementComponent', () => {
  let component: AdminEventManagementComponent;
  let fixture: ComponentFixture<AdminEventManagementComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminEventManagementComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
