import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../services/event.service';
import { Event, EventFilters, EventStats } from '../../models/event.model';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { EventFiltersComponent } from '../event-filters/event-filters.component';
import { EventTableComponent } from '../event-table/event-table.component';

@Component({
  selector: 'app-admin-event-management',
  imports: [CommonModule, EventFiltersComponent, EventTableComponent],
  templateUrl: './admin-event-management.component.html',
  styleUrl: './admin-event-management.component.css',
})
export class AdminEventManagementComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = signal(false);

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

  categories = [
    'Conference',
    'Workshop',
    'Seminar',
    'Concert',
    'Exhibition',
    'Sports',
    'Other',
  ];

  statuses = ['active', 'cancelled', 'completed'];

  constructor(
    private eventService: EventService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadEventStats();
  }

  loadEvents() {
    this.isLoading.set(true);
    this.eventService.getAllEvents(this.filters).subscribe({
      next: (response) => {
        this.events = response.data;
        this.filteredEvents = [...this.events];
        this.isLoading.set(false);
        console.log('Events loaded:', response.message);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Failed to load events:', error.message);
        alert('Failed to load events: ' + error.message);
      },
    });
  }

  loadEventStats() {
    this.eventService.getEventStats().subscribe({
      next: (stats) => {
        this.eventStats = stats;
      },
      error: (error) => {
        console.error('Failed to load event stats:', error.message);
      },
    });
  }

  onFiltersChange(newFilters: EventFilters) {
    this.filters = { ...newFilters };
    this.loadEvents();
  }

  onClearFilters() {
    this.filters = {
      searchTerm: '',
      category: '',
      status: '',
      priceFilter: '',
    };
    this.loadEvents();
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
