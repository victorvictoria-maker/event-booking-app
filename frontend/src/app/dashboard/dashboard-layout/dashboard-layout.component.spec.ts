import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { provideHttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div>Mock Component</div>',
})
class MockComponent {}

describe('DashboardLayoutComponent', () => {
  let component: DashboardLayoutComponent;
  let fixture: ComponentFixture<DashboardLayoutComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAdmin',
      'getUsername',
      'logout',
    ]);

    await TestBed.configureTestingModule({
      imports: [DashboardLayoutComponent],
      providers: [
        provideHttpClient(),
        { provide: AuthService, useValue: mockAuthService },
        provideRouter([
          { path: '', component: MockComponent },
          { path: 'admin/dashboard', component: MockComponent },
          { path: 'admin/events', component: MockComponent },
          { path: 'admin/bookings', component: MockComponent },
          { path: 'admin/profile', component: MockComponent },
          { path: 'events', component: MockComponent },
          { path: 'bookings', component: MockComponent },
          { path: 'profile', component: MockComponent },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.userName).toBe('');
      expect(component.userRole).toBe('');
      expect(component.isSidebarCollapsed).toBe(false);
      expect(component.searchQuery).toBe('');
      expect(component.menuItems).toEqual([]);
    });
  });

  describe('ngOnInit', () => {
    it('should set user role as admin and configure admin menu items', () => {
      mockAuthService.isAdmin.and.returnValue(true);
      mockAuthService.getUsername.and.returnValue('adminvicky');

      component.ngOnInit();

      expect(component.userRole).toBe('admin');
      expect(component.userName).toBe('adminvicky');
      expect(component.menuItems).toEqual([
        {
          icon: 'fas fa-tachometer-alt',
          label: 'Dashboard',
          route: '/admin/dashboard',
        },
        {
          icon: 'fas fa-calendar-alt',
          label: 'Events Management',
          route: '/admin/events',
        },
        {
          icon: 'fas fa-ticket-alt',
          label: 'Bookings',
          route: '/admin/bookings',
        },
        { icon: 'fas fa-user', label: 'Profile', route: '/admin/profile' },
      ]);
    });

    it('should set user role as user and configure user menu items', () => {
      mockAuthService.isAdmin.and.returnValue(false);
      mockAuthService.getUsername.and.returnValue('rose');

      component.ngOnInit();

      expect(component.userRole).toBe('user');
      expect(component.userName).toBe('rose');
      expect(component.menuItems).toEqual([
        {
          icon: 'fas fa-calendar',
          label: 'Browse Events',
          route: '/events',
        },
        {
          icon: 'fas fa-history',
          label: 'My Bookings',
          route: '/bookings',
        },
        { icon: 'fas fa-user', label: 'Profile', route: '/profile' },
      ]);
    });
  });

  describe('setMenuItems', () => {
    it('should set admin menu items when user role is admin', () => {
      component.userRole = 'admin';

      component.setMenuItems();

      expect(component.menuItems.length).toBe(4);
      expect(component.menuItems[0].route).toBe('/admin/dashboard');
      expect(component.menuItems[1].route).toBe('/admin/events');
      expect(component.menuItems[2].route).toBe('/admin/bookings');
      expect(component.menuItems[3].route).toBe('/admin/profile');
    });

    it('should set user menu items when user role is user', () => {
      component.userRole = 'user';

      component.setMenuItems();

      expect(component.menuItems.length).toBe(3);
      expect(component.menuItems[0].route).toBe('/events');
      expect(component.menuItems[1].route).toBe('/bookings');
      expect(component.menuItems[2].route).toBe('/profile');
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle sidebar collapsed state from false to true', () => {
      component.isSidebarCollapsed = false;

      component.toggleSidebar();

      expect(component.isSidebarCollapsed).toBe(true);
    });

    it('should toggle sidebar collapsed state from true to false', () => {
      component.isSidebarCollapsed = true;

      component.toggleSidebar();

      expect(component.isSidebarCollapsed).toBe(false);
    });
  });

  describe('onLogout', () => {
    it('should call auth service logout method', () => {
      component.logOut();

      expect(mockAuthService.logout).toHaveBeenCalled();
    });

    it('should emit logout event', () => {
      spyOn(component.logout, 'emit');

      component.onLogout();

      expect(component.logout.emit).toHaveBeenCalled();
    });
  });

  describe('onSearch', () => {
    it('should log search query when search query is not empty', () => {
      spyOn(console, 'log');
      component.searchQuery = 'test event';

      component.onSearch();

      expect(console.log).toHaveBeenCalledWith('Searching for:', 'test event');
    });

    it('should not log when search query is empty', () => {
      spyOn(console, 'log');
      component.searchQuery = '';

      component.onSearch();

      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('navigate', () => {
    it('should navigate to specified route', () => {
      spyOn(router, 'navigate');

      component.navigateTo('/admin/dashboard');

      expect(router.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
    });
  });

  describe('Component Rendering', () => {
    beforeEach(() => {
      mockAuthService.isAdmin.and.returnValue(false);
      mockAuthService.getUsername.and.returnValue('testuser');
      fixture.detectChanges();
    });

    it('should render navbar with brand name', () => {
      const brandElement = fixture.debugElement.query(
        By.css('.navbar-brand span')
      );
      expect(brandElement.nativeElement.textContent.trim()).toBe('EventBooker');
    });

    it('should render user name in title case', () => {
      component.userName = 'vicky';
      fixture.detectChanges();

      const userNameElement = fixture.debugElement.query(
        By.css('.textSecondary.fw-semibold')
      );
      expect(userNameElement.nativeElement.textContent).toBe('Vicky');
    });

    it('should render user role in title case', () => {
      component.userRole = 'admin';
      fixture.detectChanges();

      const userRoleElement = fixture.debugElement.query(
        By.css('.textGray[style*="font-size: 0.75rem"]')
      );
      expect(userRoleElement.nativeElement.textContent.trim()).toBe('Admin');
    });

    it('should render menu items in sidebar', () => {
      component.menuItems = [
        { icon: 'fas fa-calendar', label: 'Events', route: '/events' },
        { icon: 'fas fa-user', label: 'Profile', route: '/profile' },
      ];
      fixture.detectChanges();

      const menuItemElements = fixture.debugElement.queryAll(
        By.css('.nav-item .nav-link')
      );
      expect(menuItemElements.length).toBe(2);
      expect(menuItemElements[0].nativeElement.textContent.trim()).toContain(
        'Events'
      );
      expect(menuItemElements[1].nativeElement.textContent.trim()).toContain(
        'Profile'
      );
    });

    it('should apply collapsed class to sidebar when isSidebarCollapsed is true', () => {
      component.isSidebarCollapsed = true;
      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.css('.sidebar'));
      expect(sidebar.nativeElement.classList).toContain('collapsed');
    });

    it('should not apply collapsed class to sidebar when isSidebarCollapsed is false', () => {
      component.isSidebarCollapsed = false;
      fixture.detectChanges();

      const sidebar = fixture.debugElement.query(By.css('.sidebar'));
      expect(sidebar.nativeElement.classList).not.toContain('collapsed');
    });

    it('should show sidebar overlay when isSidebarCollapsed is false', () => {
      component.isSidebarCollapsed = false;
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.sidebar-overlay'));
      expect(overlay.nativeElement.classList).toContain('show');
    });

    it('should hide sidebar overlay when isSidebarCollapsed is true', () => {
      component.isSidebarCollapsed = true;
      fixture.detectChanges();

      const overlay = fixture.debugElement.query(By.css('.sidebar-overlay'));
      expect(overlay.nativeElement.classList).not.toContain('show');
    });
  });

  describe('Event Handlers', () => {
    beforeEach(() => {
      mockAuthService.isAdmin.and.returnValue(false);
      mockAuthService.getUsername.and.returnValue('testuser');
      fixture.detectChanges();
    });

    it('should call toggleSidebar when hamburger menu is clicked', () => {
      spyOn(component, 'toggleSidebar');

      const hamburgerButton = fixture.debugElement.query(
        By.css('.btn-link[type="button"]')
      );
      hamburgerButton.nativeElement.click();

      expect(component.toggleSidebar).toHaveBeenCalled();
    });

    it('should call onSearch when search button is clicked', () => {
      spyOn(component, 'onSearch');

      const searchButton = fixture.debugElement.query(
        By.css('.btn-light[type="button"]')
      );
      searchButton.nativeElement.click();

      expect(component.onSearch).toHaveBeenCalled();
    });

    it('should call logOut when sign out is clicked', () => {
      spyOn(component, 'logOut');

      const signOutButton = fixture.debugElement.query(By.css('.text-danger'));
      signOutButton.nativeElement.click();

      expect(component.logOut).toHaveBeenCalled();
    });
  });
});
