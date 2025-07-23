import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Booking } from '../../models/booking.model';
import categories from '../../data/eventCategories';
import { NairaFormat } from '../../utils/formatPrice';
import { EventUtilsService } from '../../utils/eventUtility';

interface BookingFilters {
  searchTerm: string;
  category: string;
}

interface BookingStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
}

@Component({
  selector: 'app-user-bookings',
  imports: [CommonModule, FormsModule, NairaFormat],
  templateUrl: './user-bookings.component.html',
  styleUrl: './user-bookings.component.css',
})
export class UserBookingsComponent implements OnInit {
  activeTab = signal<'upcoming' | 'completed'>('upcoming');
  allBookings: Booking[] = [];
  upcomingBookings: Booking[] = [];
  completedBookings: Booking[] = [];
  filteredUpcomingBookings: Booking[] = [];
  filteredCompletedBookings: Booking[] = [];

  bookingStats: BookingStats = {
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
  };

  isLoading = signal(false);
  cancellingBookings = signal<Record<string, boolean>>({});

  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);
  private eventUtils = inject(EventUtilsService);
  public Math = Math;

  upcomingFilters: BookingFilters = {
    searchTerm: '',
    category: '',
  };

  completedFilters: BookingFilters = {
    searchTerm: '',
    category: '',
  };

  categories = categories;

  upcomingPaginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  };

  completedPaginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  };

  ngOnInit() {
    this.loadAllUserBookings();
  }

  loadAllUserBookings() {
    this.isLoading.set(true);

    this.bookingService.getUserBookings(1, 1000).subscribe({
      next: (response) => {
        this.allBookings = response.data?.bookings || [];
        this.categorizeBookings();
        this.calculateStats();
        this.applyFiltersAndPagination();
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load bookings: ' + error.message);
      },
    });
  }

  private categorizeBookings() {
    this.upcomingBookings = this.allBookings.filter((booking) => {
      return booking.event?.status === 'active';
    });

    this.completedBookings = this.allBookings.filter((booking) => {
      return booking.event?.status === 'completed';
    });
  }

  private calculateStats() {
    this.bookingStats = {
      totalBookings: this.allBookings.length,
      upcomingBookings: this.upcomingBookings.length,
      completedBookings: this.completedBookings.length,
    };
  }

  private applyFiltersAndPagination() {
    this.filterUpcomingBookings();
    this.filterCompletedBookings();
    this.updatePagination();
  }

  filterUpcomingBookings() {
    let filteredBookings = [...this.upcomingBookings];

    if (this.upcomingFilters.searchTerm.trim()) {
      const searchTerm = this.upcomingFilters.searchTerm.toLowerCase();
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.event?.name.toLowerCase().includes(searchTerm) ||
          booking.event?.venue.toLowerCase().includes(searchTerm) ||
          booking.event?.category.toLowerCase().includes(searchTerm)
      );
    }

    if (this.upcomingFilters.category) {
      filteredBookings = filteredBookings.filter(
        (booking) => booking.event?.category === this.upcomingFilters.category
      );
    }

    this.filteredUpcomingBookings = filteredBookings;
  }

  filterCompletedBookings() {
    let filteredBookings = [...this.completedBookings];

    if (this.completedFilters.searchTerm.trim()) {
      const searchTerm = this.completedFilters.searchTerm.toLowerCase();
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.event?.name.toLowerCase().includes(searchTerm) ||
          booking.event?.venue.toLowerCase().includes(searchTerm) ||
          booking.event?.category.toLowerCase().includes(searchTerm)
      );
    }

    if (this.completedFilters.category) {
      filteredBookings = filteredBookings.filter(
        (booking) =>
          booking.event?.category.toLowerCase() ===
          this.completedFilters.category.toLowerCase()
      );
    }

    this.filteredCompletedBookings = filteredBookings;
  }

  private updatePagination() {
    const upcomingTotal = this.filteredUpcomingBookings.length;
    this.upcomingPaginationData.totalItems = upcomingTotal;
    this.upcomingPaginationData.totalPages = Math.ceil(
      upcomingTotal / this.upcomingPaginationData.itemsPerPage
    );
    this.upcomingPaginationData.hasNextPage =
      this.upcomingPaginationData.currentPage <
      this.upcomingPaginationData.totalPages;
    this.upcomingPaginationData.hasPrevPage =
      this.upcomingPaginationData.currentPage > 1;

    const completedTotal = this.filteredCompletedBookings.length;
    this.completedPaginationData.totalItems = completedTotal;
    this.completedPaginationData.totalPages = Math.ceil(
      completedTotal / this.completedPaginationData.itemsPerPage
    );
    this.completedPaginationData.hasNextPage =
      this.completedPaginationData.currentPage <
      this.completedPaginationData.totalPages;
    this.completedPaginationData.hasPrevPage =
      this.completedPaginationData.currentPage > 1;
  }

  onTabChange(tab: 'upcoming' | 'completed') {
    this.activeTab.set(tab);
  }

  onUpcomingFiltersChange() {
    this.upcomingPaginationData.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onCompletedFiltersChange() {
    this.completedPaginationData.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onClearUpcomingFilters() {
    this.upcomingFilters = {
      searchTerm: '',
      category: '',
    };
    this.onUpcomingFiltersChange();
  }

  onClearCompletedFilters() {
    this.completedFilters = {
      searchTerm: '',
      category: '',
    };
    this.onCompletedFiltersChange();
  }

  getCurrentFilters(): BookingFilters {
    return this.activeTab() === 'upcoming'
      ? this.upcomingFilters
      : this.completedFilters;
  }

  getCurrentPaginationData() {
    return this.activeTab() === 'upcoming'
      ? this.upcomingPaginationData
      : this.completedPaginationData;
  }

  getCurrentBookings(): Booking[] {
    const currentTab = this.activeTab();
    const pagination = this.getCurrentPaginationData();
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;

    if (currentTab === 'upcoming') {
      return this.filteredUpcomingBookings.slice(startIndex, endIndex);
    } else {
      return this.filteredCompletedBookings.slice(startIndex, endIndex);
    }
  }

  onCancelBooking(booking: Booking) {
    this.setCancellingState(booking._id, true);

    this.bookingService.cancelBooking(booking._id).subscribe({
      next: (response) => {
        this.setCancellingState(booking._id, false);
        this.toastr.success('Booking cancelled successfully!');
        this.loadAllUserBookings();
      },
      error: (error) => {
        this.setCancellingState(booking._id, false);
        this.toastr.error('Failed to cancel booking: ' + error.message);
      },
    });
  }

  private setCancellingState(bookingId: string, loading: boolean) {
    const currentStates = this.cancellingBookings();
    this.cancellingBookings.set({
      ...currentStates,
      [bookingId]: loading,
    });
  }

  isCancelling(bookingId: string): boolean {
    return this.cancellingBookings()[bookingId] || false;
  }

  canCancelBooking(booking: Booking): boolean {
    return booking.event.status === 'active';
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'badge bg-success';
      default:
        return 'badge bg-light text-dark';
    }
  }

  getEventStatusBadgeClass(status: string): string {
    return this.eventUtils.getEventStatusBadgeClass(status);
  }

  onPageChange(page: number) {
    if (this.activeTab() === 'upcoming') {
      this.upcomingPaginationData.currentPage = page;
    } else {
      this.completedPaginationData.currentPage = page;
    }
    this.updatePagination();
  }

  onPreviousPage() {
    const pagination = this.getCurrentPaginationData();
    if (pagination.hasPrevPage) {
      this.onPageChange(pagination.currentPage - 1);
    }
  }

  onNextPage() {
    const pagination = this.getCurrentPaginationData();
    if (pagination.hasNextPage) {
      this.onPageChange(pagination.currentPage + 1);
    }
  }
}
