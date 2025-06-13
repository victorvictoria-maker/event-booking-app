import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../services/event.service';
import {
  CategoryStats,
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

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

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
          console.error('Failed to load events:', error.message);
          alert('Failed to load events: ' + error.message);
        },
      });
  }

  loadEventStats() {
    this.eventService.getEventStatsByCategory().subscribe({
      next: (response) => {
        if (response.data && Array.isArray(response.data)) {
          const responseData: CategoryStats[] = response.data;

          const totalBookings = responseData.reduce(
            (sum: number, cat: CategoryStats) => sum + cat.bookedSeats,
            0
          );

          const totalSeats = responseData.reduce(
            (sum: number, cat: CategoryStats) => sum + cat.totalSeats,
            0
          );

          const availableSeats = totalSeats - totalBookings;

          this.eventStats = {
            totalEvents: this.paginationData.totalItems,
            activeEvents: 0,
            totalBookings: totalBookings,
            availableSeats: availableSeats,
          };

          this.getActiveEventsCount();
        }
      },
      error: (error) => {
        console.error('Failed to load event stats:', error.message);
      },
    });
  }

  getActiveEventsCount() {
    const activeFilters: EventFilters = {
      searchTerm: '',
      category: '',
      status: 'active',
      priceFilter: '',
    };

    this.eventService.getAllEvents(activeFilters, 1, 1).subscribe({
      next: (response) => {
        if (response.data?.pagination) {
          this.eventStats.activeEvents = response.data.pagination.totalItems;
        }
      },
      error: (error) => {
        console.error('Failed to load active events count:', error.message);
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
        console.log('Event created:', response.message);
        alert('Event created successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        console.error('Failed to create event:', error.message);
        alert('Failed to create event: ' + error.message);
      },
    });
  }

  updateEvent(eventData: Event) {
    this.eventService.updateEvent(eventData).subscribe({
      next: (response) => {
        console.log('Event updated:', response.message);
        alert('Event updated successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        console.error('Failed to update event:', error.message);
        alert('Failed to update event: ' + error.message);
      },
    });
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe({
      next: (response) => {
        console.log('Event deleted:', response.message);
        alert('Event deleted successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        console.error('Failed to delete event:', error.message);
        alert('Failed to delete event: ' + error.message);
      },
    });
  }

  toggleEventStatus(eventId: string) {
    this.eventService.toggleEventStatus(eventId).subscribe({
      next: (response) => {
        console.log('Event status updated:', response.message);
        alert('Event status updated successfully!');
        this.loadEvents();
        this.loadEventStats();
      },
      error: (error) => {
        console.error('Failed to update event status:', error.message);
        alert('Failed to update event status: ' + error.message);
      },
    });
  }
}
