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
  @Input() bookingLoadingStates: Record<string, boolean> = {};

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

  getAvailableSeats(event: Event): number {
    return this.eventUtils.getAvailableSeats(event);
  }

  getEventStatusBadgeClass(status: string): string {
    return this.eventUtils.getEventStatusBadgeClass(status);
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
      this.isBookingInProgress(event._id)
    );
  }

  getBookingButtonClass(event: Event): string {
    return this.eventUtils.getBookingButtonClass(
      event,
      this.userBookings,
      'btn btn-sm'
    );
  }

  isBookingInProgress(eventId: string): boolean {
    return this.bookingLoadingStates[eventId] || false;
  }

  isEventPast(event: Event): boolean {
    return this.eventUtils.isEventPast(event);
  }
}
