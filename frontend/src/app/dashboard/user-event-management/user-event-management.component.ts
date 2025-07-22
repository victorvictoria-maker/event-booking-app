import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event, EventFilters, PaginationData } from '../../models/event.model';
import { EventFiltersComponent } from '../event-filters/event-filters.component';
import { EventTableComponent } from '../event-table/event-table.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDetailsModalComponent } from '../event-details-modal/event-details-modal.component';
import { EventPaginationComponent } from '../event-pagination/event-pagination.component';
import categories from '../../data/eventCategories';

@Component({
  selector: 'app-user-event-management',
  imports: [
    CommonModule,
    EventFiltersComponent,
    EventTableComponent,
    EventPaginationComponent,
  ],
  templateUrl: './user-event-management.component.html',
  styleUrl: './user-event-management.component.css',
})
export class UserEventManagementComponent {
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

  filters: EventFilters = {
    searchTerm: '',
    category: '',
    status: 'active',
    priceFilter: '',
  };

  categories = categories;

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadEvents();
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

  onFiltersChange(newFilters: EventFilters) {
    this.filters = { ...newFilters, status: 'active' };
    this.paginationData.currentPage = 1;
    this.loadEvents();
  }

  onClearFilters() {
    this.filters = {
      searchTerm: '',
      category: '',
      status: 'active',
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

  onViewEvent(event: Event) {
    const modalRef = this.modalService.open(EventDetailsModalComponent, {
      size: 'lg',
      centered: true,
    });

    modalRef.componentInstance.event = event;

    modalRef.componentInstance.bookEvent.subscribe((eventData: Event) => {
      this.onBookEvent(eventData);
    });
  }

  onBookEvent(event: Event) {
    alert('Booking event coming soon.');
  }

  getAvailableEventsCount(): number {
    return this.filteredEvents.filter(
      (event) => event.totalSeats - event.bookedSeats > 0
    ).length;
  }

  getFreeEventsCount(): number {
    return this.filteredEvents.filter((event) => event.isFree).length;
  }

  getTotalAvailableSeats(): number {
    return this.filteredEvents.reduce(
      (acc, event) => acc + (event.totalSeats - event.bookedSeats),
      0
    );
  }
}
