import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-layout',
  imports: [CommonModule, FormsModule, RouterModule, RouterOutlet],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() logout = new EventEmitter<void>();

  userName = '';
  userRole = '';
  isSidebarCollapsed = false;
  searchQuery = '';
  menuItems: { icon: string; label: string; route: string }[] = [];

  ngOnInit() {
    this.authService.isAdmin()
      ? (this.userRole = 'admin')
      : (this.userRole = 'user');

    this.setMenuItems();
    this.userName = this.authService.getUsername() ?? '';
  }

  logOut() {
    this.authService.logout();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onLogout() {
    this.logout.emit();
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      console.log('Searching for:', this.searchQuery);
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  setMenuItems() {
    if (this.userRole === 'admin') {
      this.menuItems = [
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
        // { icon: 'fas fa-cog', label: 'Settings', route: '/admin/settings' },
      ];
    } else {
      this.menuItems = [
        // { icon: 'fas fa-home', label: 'Home', route: '/dashboard' },
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
      ];
    }
  }
}
