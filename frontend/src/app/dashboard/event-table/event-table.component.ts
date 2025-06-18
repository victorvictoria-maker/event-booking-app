import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Event } from '../../models/event.model';
import { EventUtilsService } from '../../utils/eventUtility';

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
  @Input() totalEvents: number = 0;
  @Input() userBookings: any[] = [];
  @Input() isBookingInProgress: boolean = false;

  @Output() editEvent = new EventEmitter<Event>();
  @Output() deleteEvent = new EventEmitter<string>();
  @Output() toggleEventStatus = new EventEmitter<string>();
  @Output() bookEvent = new EventEmitter<Event>();
  @Output() viewEvent = new EventEmitter<Event>();

  private eventUtils = inject(EventUtilsService);

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

  // getAvailableSeats(event: Event): number {
  //   return event.totalSeats - event.bookedSeats;
  // }

  // getStatusBadgeClass(status: string): string {
  //   switch (status) {
  //     case 'active':
  //       return 'bg-success';
  //     case 'cancelled':
  //       return 'bg-danger';
  //     case 'completed':
  //       return 'bg-secondary';
  //     default:
  //       return 'bg-secondary';
  //   }
  // }

  // getBookingPercentage(event: Event): number {
  //   return (event.bookedSeats / event.totalSeats) * 100;
  // }

  // formatPrice(event: Event): string {
  //   if (event.isFree) {
  //     return 'Free';
  //   }
  //   return event.price ? `₦${event.price.toLocaleString()}` : 'Free';
  // }

  // isEventBookable(event: Event): boolean {
  //   return event.status === 'active' && this.getAvailableSeats(event) > 0;
  // }

  // getEventStatusText(event: Event): string {
  //   if (event.status === 'active' && this.getAvailableSeats(event) === 0) {
  //     return 'Sold Out';
  //   }
  //   return event.status;
  // }

  // hasUserBookedEvent(eventId: string): boolean {
  //   return this.userBookings.some(
  //     (booking) => booking.eventId === eventId || booking.event?._id === eventId
  //   );
  // }

  // getBookingButtonText(event: Event): string {
  //   if (this.hasUserBookedEvent(event._id)) {
  //     return 'Cancel';
  //   }

  //   const availableSeats = this.getAvailableSeats(event);
  //   if (availableSeats === 0) {
  //     return 'Sold Out';
  //   }

  //   return 'Book';
  // }

  // isBookingButtonDisabled(event: Event): boolean {
  //   if (this.hasUserBookedEvent(event._id)) {
  //     return false;
  //   }

  //   return !this.isEventBookable(event);
  // }

  // getBookingButtonClass(event: Event): string {
  //   if (this.hasUserBookedEvent(event._id)) {
  //     return 'btn btn-sm btn-danger';
  //   }

  //   return 'btn btn-sm btn-primary';
  // }
  getAvailableSeats(event: Event): number {
    return this.eventUtils.getAvailableSeats(event);
  }

  getStatusBadgeClass(status: string): string {
    return this.eventUtils.getStatusBadgeClass(status);
  }

  getBookingPercentage(event: Event): number {
    return this.eventUtils.getBookingPercentage(event);
  }

  formatPrice(event: Event): string {
    return this.eventUtils.formatPrice(event);
  }

  isEventBookable(event: Event): boolean {
    return this.eventUtils.isEventBookable(event);
  }

  getEventStatusText(event: Event): string {
    return this.eventUtils.getEventStatusText(event);
  }

  hasUserBookedEvent(eventId: string): boolean {
    return this.eventUtils.hasUserBookedEvent(eventId, this.userBookings);
  }

  getBookingButtonText(event: Event): string {
    return this.eventUtils.getBookingButtonText(event, this.userBookings);
  }

  isBookingButtonDisabled(event: Event): boolean {
    return (
      this.eventUtils.isBookingButtonDisabled(event, this.userBookings) ||
      this.isBookingInProgress
    );
  }

  getBookingButtonClass(event: Event): string {
    return this.eventUtils.getBookingButtonClass(
      event,
      this.userBookings,
      'btn btn-sm'
    );
  }
}
