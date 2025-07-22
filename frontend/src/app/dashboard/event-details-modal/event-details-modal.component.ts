import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../models/event.model';
import { FormatNumber } from '../../utils/formatNumber';

@Component({
  selector: 'app-event-details-modal',
  imports: [CommonModule, FormatNumber],
  templateUrl: './event-details-modal.component.html',
  styleUrl: './event-details-modal.component.css',
})
export class EventDetailsModalComponent {
  @Input() event!: Event;
  @Output() bookEvent = new EventEmitter<Event>();

  constructor(public activeModal: NgbActiveModal) {}

  onBookEvent() {
    this.bookEvent.emit(this.event);
    this.activeModal.close();
  }

  getAvailableSeats(): number {
    return this.event.totalSeats - this.event.bookedSeats;
  }

  getBookingPercentage(): number {
    return (this.event.bookedSeats / this.event.totalSeats) * 100;
  }

  formatPrice(): string {
    if (this.event.isFree) {
      return 'Free';
    }
    return this.event.price ? `₦${this.event.price.toLocaleString()}` : 'Free';
  }

  isEventBookable(): boolean {
    return this.event.status === 'active' && this.getAvailableSeats() > 0;
  }

  getStatusBadgeClass(): string {
    switch (this.event.status) {
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

  getEventStatusText(): string {
    if (this.event.status === 'active' && this.getAvailableSeats() === 0) {
      return 'Sold Out';
    }
    return this.event.status;
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
