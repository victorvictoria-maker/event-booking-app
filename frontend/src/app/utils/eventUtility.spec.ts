import { TestBed } from '@angular/core/testing';
import { EventUtilsService } from './eventUtility';
import { mockEvent } from '../test/mock-data';
import { Event } from '../models/event.model';

describe('EventUtilsService', () => {
  let service: EventUtilsService;
  let event: Event;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventUtilsService],
    });
    service = TestBed.inject(EventUtilsService);
  });

  describe('getAvailableSeats', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return correct available seats', () => {
      event.bookedSeats = 30;
      const result = service.getAvailableSeats(event);
      expect(result).toBe(70);
    });

    it('should return 0 when all seats are booked', () => {
      event.bookedSeats = 100;
      const result = service.getAvailableSeats(event);
      expect(result).toBe(0);
    });

    it('should return total seats when no seats are booked', () => {
      event.bookedSeats = 0;
      const result = service.getAvailableSeats(event);
      expect(result).toBe(100);
    });
  });

  describe('getBookingPercentage', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return correct booking percentage', () => {
      event.bookedSeats = 30;
      const result = service.getBookingPercentage(event);
      expect(result).toBe(30);
    });

    it('should return 0 when no seats are booked', () => {
      event.bookedSeats = 0;
      const result = service.getBookingPercentage(event);
      expect(result).toBe(0);
    });

    it('should return 100 when all seats are booked', () => {
      event.bookedSeats = 100;
      const result = service.getBookingPercentage(event);
      expect(result).toBe(100);
    });
  });

  describe('formatPrice', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return "Free" for free events', () => {
      event.isFree = true;
      const result = service.formatPrice(event);
      expect(result).toBe('Free');
    });

    it('should return formatted price with naira symbol', () => {
      event.isFree = false;
      event.price = 1000;
      const result = service.formatPrice(event);
      expect(result).toBe('₦1,000');
    });

    it('should return "Free" when price is 0', () => {
      event.price = 0;
      const result = service.formatPrice(event);
      expect(result).toBe('Free');
    });
  });

  describe('isEventBookable', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return true for active event with available seats', () => {
      event.status = 'active';
      event.bookedSeats = 20;
      const result = service.isEventBookable(event);
      expect(result).toBe(true);
    });

    it('should return false for cancelled event', () => {
      event.status = 'cancelled';
      const result = service.isEventBookable(event);
      expect(result).toBe(false);
    });

    it('should return false for completed event', () => {
      event.status = 'completed';
      const result = service.isEventBookable(event);
      expect(result).toBe(false);
    });

    it('should return false when no seats available', () => {
      event.bookedSeats = 100;
      const result = service.isEventBookable(event);
      expect(result).toBe(false);
    });
  });

  describe('getEventStatusText', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return "Sold Out" for active event with no available seats', () => {
      event.status = 'active';
      event.bookedSeats = 100;
      const result = service.getEventStatusText(event);
      expect(result).toBe('Sold Out');
    });

    it('should return status for active event with available seats', () => {
      event.status = 'active';
      event.bookedSeats = 10;
      const result = service.getEventStatusText(event);
      expect(result).toBe('active');
    });

    it('should return status for cancelled event', () => {
      event.status = 'cancelled';
      const result = service.getEventStatusText(event);
      expect(result).toBe('cancelled');
    });

    it('should return status for completed event', () => {
      event.status = 'completed';
      const result = service.getEventStatusText(event);
      expect(result).toBe('completed');
    });
  });

  describe('getEventStatusBadgeClass', () => {
    it('should return correct class for active status', () => {
      const result = service.getEventStatusBadgeClass('active');
      expect(result).toBe('bg-success');
    });

    it('should return correct class for cancelled status', () => {
      const result = service.getEventStatusBadgeClass('cancelled');
      expect(result).toBe('bg-danger');
    });

    it('should return correct class for completed status', () => {
      const result = service.getEventStatusBadgeClass('completed');
      expect(result).toBe('bg-secondary');
    });

    it('should return default class for empty status', () => {
      const result = service.getEventStatusBadgeClass('');
      expect(result).toBe('bg-secondary');
    });
  });

  describe('hasUserBookedEvent', () => {
    it('should return false when user has not booked event', () => {
      const userBookings = [
        { eventId: '2', userId: 'user1' },
        { eventId: '3', userId: 'user1' },
      ];
      const result = service.hasUserBookedEvent('1', userBookings);
      expect(result).toBe(false);
    });

    it('should return false when userBookings is empty', () => {
      const result = service.hasUserBookedEvent('1', []);
      expect(result).toBe(false);
    });
  });

  describe('getBookingButtonText', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return "Cancel" when user has booked event', () => {
      const userBookings = [{ eventId: '1', userId: 'user1' }];
      const result = service.getBookingButtonText(event, userBookings);
      expect(result).toBe('Cancel');
    });

    it('should return "Sold Out" when no seats available', () => {
      event.bookedSeats = 100;
      const result = service.getBookingButtonText(event, []);
      expect(result).toBe('Sold Out');
    });

    it('should return "Book" when event is bookable', () => {
      event.bookedSeats = 20;
      event.status = 'active';
      const result = service.getBookingButtonText(event, []);
      expect(result).toBe('Book');
    });
  });

  describe('isBookingButtonDisabled', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return false when user has booked event', () => {
      const userBookings = [{ eventId: '1', userId: 'user1' }];
      const result = service.isBookingButtonDisabled(event, userBookings);
      expect(result).toBe(false);
    });

    it('should return true when event is not bookable', () => {
      event.status = 'cancelled';
      const result = service.isBookingButtonDisabled(event, []);
      expect(result).toBe(true);
    });

    it('should return false when event is bookable and user has not booked', () => {
      event.status = 'active';
      event.bookedSeats = 20;
      const result = service.isBookingButtonDisabled(event, []);
      expect(result).toBe(false);
    });

    it('should return true when all seats are booked', () => {
      event.bookedSeats = 100;
      const result = service.isBookingButtonDisabled(event, []);
      expect(result).toBe(true);
    });
  });

  describe('getBookingButtonClass', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return cancel class when user has booked event', () => {
      const userBookings = [{ eventId: '1', userId: 'user1' }];
      const result = service.getBookingButtonClass(event, userBookings);
      expect(result).toBe('btn btn-outline-danger');
    });

    it('should return secondary class when event is not bookable', () => {
      event.status = 'cancelled';
      const result = service.getBookingButtonClass(event, []);
      expect(result).toBe('btn btn-secondary');
    });

    it('should return primary class when event is bookable', () => {
      event.status = 'active';
      event.bookedSeats = 20;
      const result = service.getBookingButtonClass(event, []);
      expect(result).toBe('btn btn-primary');
    });

    it('should return secondary class for sold out event', () => {
      event.bookedSeats = 100;
      const result = service.getBookingButtonClass(event, []);
      expect(result).toBe('btn btn-secondary');
    });
  });

  describe('isEventPast', () => {
    beforeEach(() => {
      event = { ...mockEvent };
    });

    it('should return true for past event', () => {
      event.date = '2020-01-01';
      const result = service.isEventPast(event);
      expect(result).toBe(true);
    });

    it('should return false for future event', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      event.date = futureDate.toISOString().split('T')[0];
      const result = service.isEventPast(event);
      expect(result).toBe(false);
    });
  });
});
