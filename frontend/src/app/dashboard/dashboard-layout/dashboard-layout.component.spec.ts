import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLayoutComponent } from './dashboard-layout.component';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { provideRouter } from '@angular/router';

@Component({
  template: '<div>Mock Component</div>',
})
class MockComponent {}

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayoutComponent],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: '', component: MockComponent },
          { path: 'admin/dashboard', component: MockComponent },
          { path: 'events', component: MockComponent },
          { path: 'bookings', component: MockComponent },
          { path: 'profile', component: MockComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
