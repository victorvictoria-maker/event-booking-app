import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../models/event.model';
import { FormatNumber } from '../../utils/formatNumber';
import { EventUtilsService } from '../../utils/eventUtility';

@Component({
  selector: 'app-event-details-modal',
  imports: [CommonModule, FormatNumber],
  templateUrl: './event-details-modal.component.html',
  styleUrl: './event-details-modal.component.css',
})
export class EventDetailsModalComponent {
  @Input() event!: Event;
  @Input() userBookings: any[] = [];
  @Input() isBookingInProgress: boolean = false;
  @Output() bookEvent = new EventEmitter<Event>();

  private eventUtils = inject(EventUtilsService);

  constructor(public activeModal: NgbActiveModal) {}

  onBookEvent() {
    this.bookEvent.emit(this.event);
    this.activeModal.close();
  }

  get isUserBooked(): boolean {
    return this.eventUtils.hasUserBookedEvent(
      this.event._id,
      this.userBookings
    );
  }

  getAvailableSeats(): number {
    return this.eventUtils.getAvailableSeats(this.event);
  }

  getBookingPercentage(): number {
    return this.eventUtils.getBookingPercentage(this.event);
  }

  formatPrice(): string {
    return this.eventUtils.formatPrice(this.event);
  }

  isEventBookable(): boolean {
    return this.eventUtils.isEventBookable(this.event);
  }

  getStatusBadgeClass(): string {
    return this.eventUtils.getStatusBadgeClass(this.event.status);
  }

  getEventStatusText(): string {
    return this.eventUtils.getEventStatusText(this.event);
  }

  getBookingButtonText(): string {
    return this.eventUtils.getBookingButtonText(this.event, this.userBookings);
  }

  getBookingButtonDisabled(): boolean {
    return (
      this.eventUtils.isBookingButtonDisabled(this.event, this.userBookings) ||
      this.isBookingInProgress
    );
  }

  getBookingButtonClass(): string {
    return this.eventUtils.getBookingButtonClass(
      this.event,
      this.userBookings,
      'btn'
    );
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
