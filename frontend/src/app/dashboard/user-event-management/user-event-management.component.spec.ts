import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEventManagementComponent } from './user-event-management.component';

describe('UserEventManagementComponent', () => {
  let component: UserEventManagementComponent;
  let fixture: ComponentFixture<UserEventManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserEventManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserEventManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
