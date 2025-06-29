import { CommonModule } from '@angular/common';
import { Component, signal, inject, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Booking } from '../../models/booking.model';
import categories from '../../data/eventCategories';
import { NairaFormat } from '../../utils/formatPrice';

interface AdminBookingFilters {
  searchTerm: string;
  category: string;
  eventStatus: string;
}

interface AdminBookingStats {
  totalBookings: number;
  paidBookings: number;
  totalRevenue: number;
}

@Component({
  selector: 'app-admin-bookings',
  imports: [CommonModule, FormsModule, NairaFormat],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css',
})
export class AdminBookingsComponent implements OnInit {
  allBookings: Booking[] = [];
  filteredBookings: Booking[] = [];
  selectedBooking: Booking | null = null;

  bookingStats: AdminBookingStats = {
    totalBookings: 0,
    paidBookings: 0,
    totalRevenue: 0,
  };

  isLoading = signal(false);
  private bookingService = inject(BookingService);
  private toastr = inject(ToastrService);
  public Math = Math;

  filters: AdminBookingFilters = {
    searchTerm: '',
    category: '',
    eventStatus: '',
  };

  categories = categories;

  paginationData = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  };

  ngOnInit() {
    this.loadAllBookings();
    // console.log(this.allBookings, 'allBookings');
    // console.log(this.filteredBookings, 'filteredBookings');
    // console.log(this.selectedBooking, 'selectedBooking');
  }

  loadAllBookings() {
    this.isLoading.set(true);

    this.bookingService
      .getAllBookings(
        this.paginationData.currentPage,
        this.paginationData.itemsPerPage
      )
      .subscribe({
        next: (response) => {
          this.filteredBookings = response.data?.bookings || [];

          // console.log(response.data?.bookings);

          if (response.data?.pagination) {
            this.paginationData = {
              currentPage: response.data.pagination.currentPage,
              totalPages: response.data.pagination.totalPages,
              totalItems: response.data.pagination.totalItems,
              itemsPerPage: response.data.pagination.itemsPerPage,
              hasNextPage: response.data.pagination.hasNextPage,
              hasPrevPage: response.data.pagination.hasPrevPage,
            };
          }

          this.loadBookingStats();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error('Failed to load bookings: ' + error.message);
        },
      });
  }

  private loadBookingStats() {
    this.bookingService.getAllBookings(1, 1000).subscribe({
      next: (response) => {
        this.allBookings = response.data?.bookings || [];
        // console.log(this.allBookings, 'allBookings');
        // console.log(this.filteredBookings, 'filteredBookings');
        this.calculateStats();
        // console.log('Viewing all bookings stats:', this.allBookings);
      },
      error: (error) => {
        console.error('Failed to load booking stats:', error);
      },
    });
  }

  private calculateStats() {
    this.bookingStats = {
      totalBookings: this.allBookings.length,
      paidBookings: this.allBookings.filter((b) => b.paymentStatus === 'paid')
        .length,
      totalRevenue: this.allBookings
        .filter((b) => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0),
    };
  }

  onFiltersChange() {
    this.paginationData.currentPage = 1;
    this.loadFilteredBookings();
  }

  private loadFilteredBookings() {
    this.isLoading.set(true);

    this.loadAllBookingsWithFilters();
  }

  private loadAllBookingsWithFilters() {
    this.bookingService.getAllBookings(1, 1000).subscribe({
      next: (response) => {
        let allBookings = response.data?.bookings || [];

        let filtered = this.applyFilters(allBookings);

        const total = filtered.length;
        const totalPages = Math.ceil(total / this.paginationData.itemsPerPage);
        const startIndex =
          (this.paginationData.currentPage - 1) *
          this.paginationData.itemsPerPage;
        const endIndex = startIndex + this.paginationData.itemsPerPage;

        this.filteredBookings = filtered.slice(startIndex, endIndex);

        this.paginationData = {
          ...this.paginationData,
          totalItems: total,
          totalPages: totalPages,
          hasNextPage: this.paginationData.currentPage < totalPages,
          hasPrevPage: this.paginationData.currentPage > 1,
        };

        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toastr.error('Failed to load bookings: ' + error.message);
      },
    });
  }

  private applyFilters(bookings: Booking[]): Booking[] {
    let filtered = [...bookings];

    if (this.filters.searchTerm.trim()) {
      const searchTerm = this.filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.event.name.toLowerCase().includes(searchTerm) ||
          booking.event.venue.toLowerCase().includes(searchTerm) ||
          booking.user.username.toLowerCase().includes(searchTerm) ||
          booking.user.email.toLowerCase().includes(searchTerm) ||
          booking._id.toLowerCase().includes(searchTerm)
      );
    }

    if (this.filters.category) {
      filtered = filtered.filter(
        (booking) =>
          booking.event.category.toLowerCase() ===
          this.filters.category.toLowerCase()
      );
    }

    if (this.filters.eventStatus) {
      filtered = filtered.filter(
        (booking) => booking.event.status === this.filters.eventStatus
      );
    }

    return filtered;
  }

  onClearFilters() {
    this.filters = {
      searchTerm: '',
      category: '',
      eventStatus: '',
    };
    this.paginationData.currentPage = 1;
    this.loadAllBookings();
  }

  getCurrentPageBookings(): Booking[] {
    return this.filteredBookings;
  }

  onPageChange(page: number) {
    this.paginationData.currentPage = page;

    if (this.hasActiveFilters()) {
      this.loadFilteredBookings();
    } else {
      this.loadAllBookings();
    }
  }

  private hasActiveFilters(): boolean {
    return !!(
      this.filters.searchTerm.trim() ||
      this.filters.category ||
      this.filters.eventStatus
    );
  }

  onPreviousPage() {
    if (this.paginationData.hasPrevPage) {
      this.onPageChange(this.paginationData.currentPage - 1);
    }
  }

  onNextPage() {
    if (this.paginationData.hasNextPage) {
      this.onPageChange(this.paginationData.currentPage + 1);
    }
  }

  onViewBookingDetails(booking: Booking) {
    this.selectedBooking = booking;
    const modalElement = document.getElementById('bookingDetailsModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onContactUser(user: { username: string; email: string }) {
    const subject = encodeURIComponent('Regarding Your Event Booking');
    const body = encodeURIComponent(
      `Hello ${user.username},\n\nI hope this message finds you well.\n\nBest regards`
    );
    const mailtoLink = `mailto:${user.email}?subject=${subject}&body=${body}`;

    window.open(mailtoLink, '_blank');
  }

  onExportBooking(booking: Booking) {
    const csvData = this.generateBookingCSV([booking]);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-${booking._id.slice(-8)}.csv`;
    link.click();

    window.URL.revokeObjectURL(url);
    this.toastr.success('Booking data exported successfully');
  }

  onExportAllBookings() {
    if (this.allBookings.length === 0) {
      this.toastr.warning(
        'No bookings data available. Please wait for data to load.'
      );
      return;
    }

    this.isLoading.set(true);

    try {
      let bookingsToExport = [...this.allBookings];

      if (this.hasActiveFilters()) {
        bookingsToExport = this.applyFilters(bookingsToExport);
      }

      if (bookingsToExport.length === 0) {
        this.toastr.warning('No bookings to export');
        this.isLoading.set(false);
        return;
      }

      const csvData = this.generateBookingCSV(bookingsToExport);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;

      const filename = this.hasActiveFilters()
        ? `filtered-bookings-${new Date().toISOString().split('T')[0]}.csv`
        : `all-bookings-${new Date().toISOString().split('T')[0]}.csv`;

      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(url);
      this.toastr.success(
        `${bookingsToExport.length} bookings exported successfully`
      );
    } catch (error) {
      this.toastr.error('Failed to export bookings');
      console.error('Export error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private generateBookingCSV(bookings: Booking[]): string {
    const headers = [
      'Booking ID',
      'User Name',
      'User Email',
      'Event Name',
      'Event Date',
      'Event Time',
      'Event Venue',
      'Event Category',
      'Event Status',
      'Total Amount',
      'Payment Status',
      'Booking Date',
    ];

    const csvRows = [headers.join(',')];

    bookings.forEach((booking) => {
      const row = [
        booking._id,
        `"${booking.user.username}"`,
        booking.user.email,
        `"${booking.event.name}"`,
        new Date(booking.event.date).toLocaleDateString(),
        booking.event.time,
        `"${booking.event.venue}"`,
        booking.event.category,
        booking.event.status,
        booking.totalAmount,
        booking.paymentStatus,
        new Date(booking.bookingDate).toLocaleDateString(),
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  }

  getPaymentStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'failed':
        return 'badge bg-danger';
      case 'refunded':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark';
    }
  }

  getEventStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'badge bg-primary';
      case 'cancelled':
        return 'badge bg-danger';
      case 'completed':
        return 'badge bg-secondary';
      default:
        return 'badge bg-light text-dark';
    }
  }
}
