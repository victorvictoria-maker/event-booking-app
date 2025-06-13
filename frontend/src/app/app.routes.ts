import { Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./auth/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
  },
  {
    path: 'admin/signup',
    loadComponent: () =>
      import('./auth/admin-signup/admin-signup.component').then(
        (m) => m.AdminSignupComponent
      ),
  },
  {
    path: '',
    loadComponent: () =>
      import('./dashboard/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/user-dashboard/user-dashboard.component').then(
            (m) => m.UserDashboardComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import(
            './dashboard/user-event-management/user-event-management.component'
          ).then((m) => m.UserEventManagementComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./dashboard/user-dashboard/user-dashboard.component').then(
            (m) => m.UserDashboardComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboard/user-dashboard/user-dashboard.component').then(
            (m) => m.UserDashboardComponent
          ),
      },
    ],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./dashboard/dashboard-layout/dashboard-layout.component').then(
        (m) => m.DashboardLayoutComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard/admin-dashboard.component').then(
            (m) => m.AdminDashboardComponent
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import(
            './dashboard/admin-event-management/admin-event-management.component'
          ).then((m) => m.AdminEventManagementComponent),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./dashboard/admin-bookings/admin-bookings.component').then(
            (m) => m.AdminBookingsComponent
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./dashboard/admin-profile/admin-profile.component').then(
            (m) => m.AdminProfileComponent
          ),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
