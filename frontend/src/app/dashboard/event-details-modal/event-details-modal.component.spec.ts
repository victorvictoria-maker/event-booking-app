import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventDetailsModalComponent } from './event-details-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventUtilsService } from '../../utils/eventUtility';
import { FormatNumber } from '../../utils/formatNumber';
import { CommonModule } from '@angular/common';
import { mockEvent } from '../../test/mock-data';
import { MockEventUtilsService } from '../../test/mock-event-utils.service';

describe('EventDetailsModalComponent', () => {
  let component: EventDetailsModalComponent;
  let fixture: ComponentFixture<EventDetailsModalComponent>;
  let mockEventUtils: MockEventUtilsService;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;

  const userBookings = [{ eventId: '1', userId: 'user1' }];

  beforeEach(async () => {
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', [
      'close',
      'dismiss',
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormatNumber, EventDetailsModalComponent],
      providers: [
        { provide: EventUtilsService, useClass: MockEventUtilsService },
        { provide: NgbActiveModal, useValue: mockActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsModalComponent);
    component = fixture.componentInstance;
    mockEventUtils = TestBed.inject(
      EventUtilsService
    ) as unknown as MockEventUtilsService;

    component.event = mockEvent;
    component.userBookings = userBookings;
    component.isBookingInProgress = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onBookEvent', () => {
    it('should emit bookEvent and close modal', () => {
      spyOn(component.bookEvent, 'emit');

      component.onBookEvent();

      expect(component.bookEvent.emit).toHaveBeenCalledWith(mockEvent);
      expect(mockActiveModal.close).toHaveBeenCalled();
    });
  });

  describe('isUserBooked getter', () => {
    it('should return true when user has booked event', () => {
      mockEventUtils.hasUserBookedEvent.and.returnValue(true);

      const result = component.isUserBooked;

      expect(result).toBe(true);
      expect(mockEventUtils.hasUserBookedEvent).toHaveBeenCalledWith(
        '1',
        userBookings
      );
    });

    it('should return false when user has not booked event', () => {
      mockEventUtils.hasUserBookedEvent.and.returnValue(false);

      const result = component.isUserBooked;

      expect(result).toBe(false);
      expect(mockEventUtils.hasUserBookedEvent).toHaveBeenCalledWith(
        '1',
        userBookings
      );
    });
  });

  describe('utility method wrappers', () => {
    it('should call getAvailableSeats from eventUtils', () => {
      mockEventUtils.getAvailableSeats.and.returnValue(30);

      const result = component.getAvailableSeats();

      expect(result).toBe(30);
      expect(mockEventUtils.getAvailableSeats).toHaveBeenCalledWith(mockEvent);
    });

    it('should call getBookingPercentage from eventUtils', () => {
      mockEventUtils.getBookingPercentage.and.returnValue(75);

      const result = component.getBookingPercentage();

      expect(result).toBe(75);
      expect(mockEventUtils.getBookingPercentage).toHaveBeenCalledWith(
        mockEvent
      );
    });

    it('should call formatPrice from eventUtils', () => {
      mockEventUtils.formatPrice.and.returnValue('₦2,500');

      const result = component.formatPrice();

      expect(result).toBe('₦2,500');
      expect(mockEventUtils.formatPrice).toHaveBeenCalledWith(mockEvent);
    });

    it('should call isEventBookable from eventUtils', () => {
      mockEventUtils.isEventBookable.and.returnValue(false);

      const result = component.isEventBookable();

      expect(result).toBe(false);
      expect(mockEventUtils.isEventBookable).toHaveBeenCalledWith(mockEvent);
    });

    it('should call getEventStatusBadgeClass from eventUtils', () => {
      mockEventUtils.getEventStatusBadgeClass.and.returnValue('bg-danger');

      const result = component.getEventStatusBadgeClass();

      expect(result).toBe('bg-danger');
      expect(mockEventUtils.getEventStatusBadgeClass).toHaveBeenCalledWith(
        mockEvent.status
      );
    });

    it('should call getEventStatusText from eventUtils', () => {
      mockEventUtils.getEventStatusText.and.returnValue('completed');

      const result = component.getEventStatusText();

      expect(result).toBe('completed');
      expect(mockEventUtils.getEventStatusText).toHaveBeenCalledWith(mockEvent);
    });

    it('should call getBookingButtonText from eventUtils', () => {
      mockEventUtils.getBookingButtonText.and.returnValue('Cancel');

      const result = component.getBookingButtonText();

      expect(result).toBe('Cancel');
      expect(mockEventUtils.getBookingButtonText).toHaveBeenCalledWith(
        mockEvent,
        userBookings
      );
    });

    it('should call getBookingButtonClass from eventUtils', () => {
      mockEventUtils.getBookingButtonClass.and.returnValue(
        'btn btn-outline-danger'
      );

      const result = component.getBookingButtonClass();

      expect(result).toBe('btn btn-outline-danger');
      expect(mockEventUtils.getBookingButtonClass).toHaveBeenCalledWith(
        mockEvent,
        userBookings,
        'btn'
      );
    });
  });

  describe('getBookingButtonDisabled', () => {
    it('should return true when eventUtils says button is disabled', () => {
      mockEventUtils.isBookingButtonDisabled.and.returnValue(true);
      component.isBookingInProgress = false;

      const result = component.getBookingButtonDisabled();

      expect(result).toBe(true);
      expect(mockEventUtils.isBookingButtonDisabled).toHaveBeenCalledWith(
        mockEvent,
        userBookings
      );
    });

    it('should return true when booking is in progress', () => {
      mockEventUtils.isBookingButtonDisabled.and.returnValue(false);
      component.isBookingInProgress = true;

      const result = component.getBookingButtonDisabled();

      expect(result).toBe(true);
    });

    it('should return false when eventUtils says button is enabled and booking not in progress', () => {
      mockEventUtils.isBookingButtonDisabled.and.returnValue(false);
      component.isBookingInProgress = false;

      const result = component.getBookingButtonDisabled();

      expect(result).toBe(false);
    });
  });

  describe('dismiss', () => {
    it('should call activeModal.dismiss', () => {
      component.dismiss();

      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
