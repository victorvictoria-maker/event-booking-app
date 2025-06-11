import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event, EventFilters } from '../../models/event.model';
import { EventFiltersComponent } from '../event-filters/event-filters.component';
import { EventTableComponent } from '../event-table/event-table.component';

@Component({
  selector: 'app-user-event-management',
  imports: [CommonModule, EventFiltersComponent, EventTableComponent],
  templateUrl: './user-event-management.component.html',
  styleUrl: './user-event-management.component.css',
})
export class UserEventManagementComponent {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading = signal(false);

  filters: EventFilters = {
    searchTerm: '',
    category: '',
    status: 'active',
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

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading.set(true);
    this.eventService.getAllEvents(this.filters).subscribe({
      next: (response) => {
        this.events = response.data.filter(
          (event: Event) => event.status === 'active'
        );
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

  onFiltersChange(newFilters: EventFilters) {
    this.filters = { ...newFilters, status: 'active' };
    this.loadEvents();
  }

  onClearFilters() {
    this.filters = {
      searchTerm: '',
      category: '',
      status: 'active',
      priceFilter: '',
    };
    this.loadEvents();
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
