import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../services/event.service';
import {
  Event,
  EventFilters,
  EventStats,
  PaginationData,
} from '../../models/event.model';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { EventFiltersComponent } from '../event-filters/event-filters.component';
import { EventTableComponent } from '../event-table/event-table.component';
import { FormatNumber } from '../../utils/formatNumber';
import { EventPaginationComponent } from '../event-pagination/event-pagination.component';
import categories from '../../data/eventCategories';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-admin-event-management',
  imports: [
    CommonModule,
    EventFiltersComponent,
    EventTableComponent,
    FormatNumber,
    EventPaginationComponent,
  ],
  templateUrl: './admin-event-management.component.html',
  styleUrl: './admin-event-management.component.css',
})
export class AdminEventManagementComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = signal(false);

  private eventService = inject(EventService);
  private bookingService = inject(BookingService);
  public modalService = inject(NgbModal);
  private toastr = inject(ToastrService);

  paginationData: PaginationData = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  };

  eventStats: EventStats = {
    totalEvents: 0,
    activeEvents: 0,
    totalBookings: 0,
    availableSeats: 0,
  };

  filters: EventFilters = {
    searchTerm: '',
    category: '',
    status: '',
    priceFilter: '',
  };

  categories = categories;

  statuses = ['active', 'cancelled', 'completed'];

  ngOnInit() {
    this.loadEvents();
    this.loadEventStats();
  }

  loadEvents(page: number = 1) {
    this.isLoading.set(true);
    this.paginationData.currentPage = page;

    this.eventService
      .getAllEvents(this.filters, page, this.paginationData.itemsPerPage)
      .subscribe({
        next: (response) => {
          this.events = response.data?.events || [];
          this.filteredEvents = [...this.events];

          if (response.data?.pagination) {
            this.paginationData = {
              currentPage: response.data.pagination.currentPage,
              totalPages: response.data.pagination.totalPages,
              totalItems: response.data.pagination.totalItems,
              itemsPerPage: response.data.pagination.itemsPerPage,
              hasNextPage: response.data.pagination.hasNextPage,
              hasPrevPage: response.data.pagination.hasPrevPage,
            };

            this.eventStats.totalEvents = this.paginationData.totalItems;
          }

          this.isLoading.set(false);
        },

        error: (error) => {
          this.isLoading.set(false);
          this.toastr.error('Failed to load user bookings: ' + error.message);
        },
      });
  }

  loadEventStats() {
    this.eventService.getEventStats().subscribe({
      next: (response) => {
        const stats = response.data;

        this.eventStats = {
          totalEvents: stats.totalEvents,
          activeEvents: stats.activeEvents,
          totalBookings: stats.totalBookings,
          availableSeats: stats.totalAvailableSeats,
        };
      },
      error: (error) => {
        console.error('Failed to load event statistics:', error.message);
        this.toastr.error('Failed to load statistics: ' + error.message);
      },
    });
  }

  onFiltersChange(newFilters: EventFilters) {
    this.filters = { ...newFilters };
    this.paginationData.currentPage = 1;
    this.loadEvents();
  }

  onClearFilters() {
    this.filters = {
      searchTerm: '',
      category: '',
      status: '',
      priceFilter: '',
    };
    this.paginationData.currentPage = 1;
    this.loadEvents();
  }

  onPageChange(page: number) {
    this.loadEvents(page);
  }

  onPreviousPage() {
    if (this.paginationData.hasPrevPage) {
      this.loadEvents(this.paginationData.currentPage - 1);
    }
  }

  onNextPage() {
    if (this.paginationData.hasNextPage) {
      this.loadEvents(this.paginationData.currentPage + 1);
    }
  }

  openCreateEventModal() {
    const modalRef = this.modalService.open(EventModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.isEditMode = false;
    modalRef.componentInstance.categories = this.categories;

    modalRef.componentInstance.eventSubmit.subscribe((eventData: Event) => {
      this.createEvent(eventData);
    });
  }

  openEditEventModal(event: Event) {
    if (event.status === 'completed') {
      this.toastr.warning('Completed events cannot be edited');
      return;
    }

    const modalRef = this.modalService.open(EventModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.event = event;
    modalRef.componentInstance.isEditMode = true;
    modalRef.componentInstance.categories = this.categories;

    modalRef.componentInstance.eventSubmit.subscribe((eventData: Event) => {
      this.updateEvent(eventData);
    });
  }

  createEvent(eventData: Event) {
    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        this.toastr.success('Event created successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        this.toastr.error('Failed to create event:', error.message);
      },
    });
  }

  updateEvent(eventData: Event) {
    this.eventService.updateEvent(eventData).subscribe({
      next: (response) => {
        this.toastr.success('Event updated successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        this.toastr.error('Failed to update event:', error.message);
      },
    });
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: (response) => {
        this.toastr.success('Event deleted successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        this.toastr.error('Failed to delete event: ' + error.message);
      },
    });
  }

  toggleEventStatus(eventId: string) {
    const event = this.events.find((e) => e._id === eventId);

    if (event && event.status === 'completed') {
      this.toastr.warning('Completed events cannot have their status changed');
      return;
    }

    this.eventService.toggleEventStatus(eventId).subscribe({
      next: (response) => {
        this.toastr.success('Event status updated successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        this.toastr.error('Failed to update event status: ' + error.message);
      },
    });
  }
}
