import { Injectable } from '@angular/core';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root',
})
export class EventUtilsService {
  getAvailableSeats(event: Event): number {
    return event.totalSeats - event.bookedSeats;
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

  getEventStatusBadgeClass(status: string): string {
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

  hasUserBookedEvent(eventId: string, userBookings: any[]): boolean {
    return userBookings.some(
      (booking) => booking.eventId === eventId || booking.event?._id === eventId
    );
  }

  getBookingButtonText(event: Event, userBookings: any[]): string {
    if (this.hasUserBookedEvent(event._id, userBookings)) {
      return 'Cancel';
    }

    const availableSeats = this.getAvailableSeats(event);
    if (availableSeats === 0) {
      return 'Sold Out';
    }

    return 'Book';
  }

  isBookingButtonDisabled(event: Event, userBookings: any[]): boolean {
    if (this.hasUserBookedEvent(event._id, userBookings)) {
      return false;
    }

    return !this.isEventBookable(event);
  }

  getBookingButtonClass(
    event: Event,
    userBookings: any[],
    baseClass: string = 'btn'
  ): string {
    if (this.hasUserBookedEvent(event._id, userBookings)) {
      return `${baseClass} btn-outline-danger`;
    }

    if (!this.isEventBookable(event)) {
      return `${baseClass} btn-secondary`;
    }

    return `${baseClass} btn-primary`;
  }

  isEventPast(event: Event): boolean {
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    return eventDate < currentDate;
  }
}
