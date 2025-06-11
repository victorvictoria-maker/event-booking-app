import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Event } from '../../models/event.model';

export type EventTableMode = 'admin' | 'user';

@Component({
  selector: 'app-event-table',
  imports: [CommonModule],
  templateUrl: './event-table.component.html',
  styleUrl: './event-table.component.css',
})
export class EventTableComponent {
  @Input() events: Event[] = [];
  @Input() mode: EventTableMode = 'admin';
  @Input() isLoading: boolean = false;

  @Output() editEvent = new EventEmitter<Event>();
  @Output() deleteEvent = new EventEmitter<string>();
  @Output() toggleEventStatus = new EventEmitter<string>();
  @Output() bookEvent = new EventEmitter<Event>();
  @Output() viewEvent = new EventEmitter<Event>();

  onEditEvent(event: Event) {
    this.editEvent.emit(event);
  }

  onDeleteEvent(eventId: string) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.deleteEvent.emit(eventId);
    }
  }

  onToggleEventStatus(eventId: string) {
    this.toggleEventStatus.emit(eventId);
  }

  onBookEvent(event: Event) {
    this.bookEvent.emit(event);
  }

  onViewEvent(event: Event) {
    this.viewEvent.emit(event);
  }

  getAvailableSeats(event: Event): number {
    return event.totalSeats - event.bookedSeats;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'completed':
        return 'bg-secondary';
      default:
        return 'bg-secondary';
    }
  }

  getBookingPercentage(event: Event): number {
    return (event.bookedSeats / event.totalSeats) * 100;
  }

  formatPrice(event: Event): string {
    if (event.isFree) {
      return 'Free';
    }
    return event.price ? `₦${event.price.toLocaleString()}` : 'Free';
  }

  isEventBookable(event: Event): boolean {
    return event.status === 'active' && this.getAvailableSeats(event) > 0;
  }

  getEventStatusText(event: Event): string {
    if (event.status === 'active' && this.getAvailableSeats(event) === 0) {
      return 'Sold Out';
    }
    return event.status;
  }
}
