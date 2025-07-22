import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEventManagementComponent } from './user-event-management.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { EventUtilsService } from '../../utils/eventUtility';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { EventDetailsModalComponent } from '../event-details-modal/event-details-modal.component';
import { EventFilters } from '../../models/event.model';
import {
  mockEvent,
  mockEvents,
  mockBookings,
  mockPaginationData,
  mockEventsResponse,
  mockBookingsResponse,
  mockEmptyEventsResponse,
  mockEmptyBookingsResponse,
  mockCreateBookingResponse,
  mockCancelBookingResponse,
} from '../../test/mock-data';
import { MockEventUtilsService } from '../../test/mock-event-utils.service';

describe('UserEventManagementComponent', () => {
  let component: UserEventManagementComponent;
  let fixture: ComponentFixture<UserEventManagementComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockBookingService: jasmine.SpyObj<BookingService>;
  let mockEventUtils: MockEventUtilsService;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    mockEventService = jasmine.createSpyObj('EventService', ['getAllEvents']);
    mockBookingService = jasmine.createSpyObj('BookingService', [
      'getUserBookings',
      'createBooking',
      'cancelBooking',
    ]);
    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      imports: [UserEventManagementComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: EventService, useValue: mockEventService },
        { provide: BookingService, useValue: mockBookingService },
        { provide: EventUtilsService, useClass: MockEventUtilsService },
        { provide: NgbModal, useValue: mockModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEventManagementComponent);
    component = fixture.componentInstance;
    mockEventUtils = TestBed.inject(
      EventUtilsService
    ) as unknown as MockEventUtilsService;

    mockEventService.getAllEvents.and.returnValue(of(mockEventsResponse));
    mockBookingService.getUserBookings.and.returnValue(
      of(mockBookingsResponse)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load events and user bookings on init', () => {
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadUserBookings');

      component.ngOnInit();

      expect(component.loadEvents).toHaveBeenCalled();
      expect(component.loadUserBookings).toHaveBeenCalled();
    });
  });

  describe('loadEvents', () => {
    it('should load events successfully', () => {
      component.loadEvents();

      expect(component.isLoading()).toBe(false);
      expect(component.events).toEqual(mockEvents);
      expect(component.filteredEvents).toEqual(mockEvents);
      expect(component.paginationData).toEqual(mockPaginationData);
      expect(mockEventService.getAllEvents).toHaveBeenCalledWith(
        component.filters,
        1,
        10
      );
    });

    it('should handle events loading error', () => {
      const errorMessage = 'Failed to load events';
      mockEventService.getAllEvents.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadEvents();

      expect(component.isLoading()).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load events: ' + errorMessage
      );
    });

    it('should handle empty events response', () => {
      mockEventService.getAllEvents.and.returnValue(
        of(mockEmptyEventsResponse)
      );

      component.loadEvents();

      expect(component.events).toEqual([]);
      expect(component.filteredEvents).toEqual([]);
    });
  });

  describe('loadUserBookings', () => {
    it('should load user bookings successfully', () => {
      component.loadUserBookings();

      expect(component.userBookings).toEqual(mockBookings);
      expect(mockBookingService.getUserBookings).toHaveBeenCalled();
    });

    it('should handle user bookings loading error', () => {
      const errorMessage = 'Failed to load bookings';
      mockBookingService.getUserBookings.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadUserBookings();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load user bookings: ' + errorMessage
      );
    });

    it('should handle empty bookings response', () => {
      mockBookingService.getUserBookings.and.returnValue(
        of(mockEmptyBookingsResponse)
      );

      component.loadUserBookings();

      expect(component.userBookings).toEqual([]);
    });
  });

  describe('onFiltersChange', () => {
    it('should update filters and reload events', () => {
      spyOn(component, 'loadEvents');
      const newFilters: EventFilters = {
        searchTerm: 'test',
        category: 'Technology',
        status: 'active',
        priceFilter: 'free',
      };

      component.onFiltersChange(newFilters);

      expect(component.filters).toEqual({
        ...newFilters,
        status: 'active',
      });
      expect(component.paginationData.currentPage).toBe(1);
      expect(component.loadEvents).toHaveBeenCalled();
    });
  });

  describe('onClearFilters', () => {
    it('should reset filters and reload events', () => {
      spyOn(component, 'loadEvents');
      component.filters = {
        searchTerm: 'test',
        category: 'Technology',
        status: 'active',
        priceFilter: 'paid',
      };

      component.onClearFilters();

      expect(component.filters).toEqual({
        searchTerm: '',
        category: '',
        status: 'active',
        priceFilter: '',
      });
      expect(component.paginationData.currentPage).toBe(1);
      expect(component.loadEvents).toHaveBeenCalled();
    });
  });

  describe('Pagination Methods', () => {
    it('should handle page change', () => {
      spyOn(component, 'loadEvents');

      component.onPageChange(3);

      expect(component.loadEvents).toHaveBeenCalledWith(3);
    });

    it('should handle previous page when has previous page', () => {
      spyOn(component, 'loadEvents');
      component.paginationData.hasPrevPage = true;
      component.paginationData.currentPage = 3;

      component.onPreviousPage();

      expect(component.loadEvents).toHaveBeenCalledWith(2);
    });

    it('should not handle previous page when no previous page', () => {
      spyOn(component, 'loadEvents');
      component.paginationData.hasPrevPage = false;

      component.onPreviousPage();

      expect(component.loadEvents).not.toHaveBeenCalled();
    });

    it('should handle next page when has next page', () => {
      spyOn(component, 'loadEvents');
      component.paginationData.hasNextPage = true;
      component.paginationData.currentPage = 2;

      component.onNextPage();

      expect(component.loadEvents).toHaveBeenCalledWith(3);
    });

    it('should not handle next page when no next page', () => {
      spyOn(component, 'loadEvents');
      component.paginationData.hasNextPage = false;

      component.onNextPage();

      expect(component.loadEvents).not.toHaveBeenCalled();
    });
  });

  describe('onViewEvent', () => {
    it('should open modal with correct configuration and event data', () => {
      const mockModalRef = {
        componentInstance: {
          event: mockEvent,
          userBookings: component.userBookings,
          isBookingInProgress: component.isBookingInProgress,
          bookEvent: {
            subscribe: jasmine.createSpy('subscribe'),
          },
        },
      };
      mockModalService.open.and.returnValue(mockModalRef as any);

      component.onViewEvent(mockEvent);

      expect(mockModalService.open).toHaveBeenCalledWith(
        EventDetailsModalComponent,
        {
          size: 'lg',
          centered: true,
        }
      );
      expect(mockModalRef.componentInstance.event).toBe(mockEvent);
      expect(mockModalRef.componentInstance.userBookings).toBe(
        component.userBookings
      );
      expect(mockModalRef.componentInstance.isBookingInProgress).toBe(
        component.isBookingInProgress
      );
      expect(
        mockModalRef.componentInstance.bookEvent.subscribe
      ).toHaveBeenCalled();
    });

    it('should subscribe to bookEvent and call onBookEvent', () => {
      const mockModalRef = {
        componentInstance: {
          event: mockEvent,
          userBookings: component.userBookings,
          isBookingInProgress: component.isBookingInProgress,
          bookEvent: {
            subscribe: jasmine
              .createSpy('subscribe')
              .and.callFake((callback: any) => {
                callback(mockEvent);
              }),
          },
        },
      };
      mockModalService.open.and.returnValue(mockModalRef as any);
      spyOn(component, 'onBookEvent');

      component.onViewEvent(mockEvent);

      expect(component.onBookEvent).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('onBookEvent', () => {
    it('should cancel booking when user has existing booking', () => {
      const mockBooking = { _id: 'booking123', eventId: '1' };
      spyOn(component, 'getUserBookingForEvent').and.returnValue(mockBooking);
      spyOn(component, 'cancelBooking');

      component.onBookEvent(mockEvent);

      expect(component.getUserBookingForEvent).toHaveBeenCalledWith(
        mockEvent._id
      );
      expect(component.cancelBooking).toHaveBeenCalledWith(
        mockBooking._id,
        mockEvent
      );
    });

    it('should create booking when user has no existing booking', () => {
      spyOn(component, 'getUserBookingForEvent').and.returnValue(null);
      spyOn(component, 'createBooking');

      component.onBookEvent(mockEvent);

      expect(component.getUserBookingForEvent).toHaveBeenCalledWith(
        mockEvent._id
      );
      expect(component.createBooking).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('createBooking', () => {
    it('should create booking successfully', () => {
      mockEventUtils.isEventBookable.and.returnValue(true);
      mockBookingService.createBooking.and.returnValue(
        of(mockCreateBookingResponse)
      );
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadUserBookings');

      component['createBooking'](mockEvent);

      expect(mockBookingService.createBooking).toHaveBeenCalledWith(
        mockEvent._id
      );
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Event booked successfully!'
      );
      expect(component.loadEvents).toHaveBeenCalledWith(
        component.paginationData.currentPage
      );
      expect(component.loadUserBookings).toHaveBeenCalled();
    });

    it('should not create booking when event is not bookable', () => {
      mockEventUtils.isEventBookable.and.returnValue(false);

      component['createBooking'](mockEvent);

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'This event is not available for booking.'
      );
      expect(mockBookingService.createBooking).not.toHaveBeenCalled();
    });

    it('should handle booking creation error', () => {
      mockEventUtils.isEventBookable.and.returnValue(true);
      const errorMessage = 'Booking failed';
      mockBookingService.createBooking.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component['createBooking'](mockEvent);

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to book event:',
        errorMessage
      );
    });
  });

  describe('cancelBooking', () => {
    it('should cancel booking successfully', () => {
      mockBookingService.cancelBooking.and.returnValue(
        of(mockCancelBookingResponse)
      );
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadUserBookings');

      component['cancelBooking']('booking1', mockEvent);

      expect(mockBookingService.cancelBooking).toHaveBeenCalledWith('booking1');
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Booking cancelled successfully!'
      );
      expect(component.loadEvents).toHaveBeenCalledWith(
        component.paginationData.currentPage
      );
      expect(component.loadUserBookings).toHaveBeenCalled();
    });

    it('should handle booking cancellation error', () => {
      const errorMessage = 'Cancellation failed';
      mockBookingService.cancelBooking.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component['cancelBooking']('booking1', mockEvent);

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to cancel booking:',
        errorMessage
      );
    });
  });

  describe('getUserBookingForEvent', () => {
    beforeEach(() => {
      component.userBookings = mockBookings;
    });

    it('should return booking when found by eventId', () => {
      const result = component['getUserBookingForEvent']('1');
      expect(result).toBe(mockBookings[0]);
    });

    it('should return booking when found by event._id', () => {
      const bookingWithNestedEvent = {
        ...mockBookings[0],
        eventId: 'different',
        event: { _id: '1' },
      };
      component.userBookings = [bookingWithNestedEvent];

      const result = component['getUserBookingForEvent']('1');
      expect(result).toBe(bookingWithNestedEvent);
    });

    it('should return undefined when booking not found', () => {
      const result = component['getUserBookingForEvent']('999');
      expect(result).toBeUndefined();
    });
  });

  describe('Utility Methods', () => {
    beforeEach(() => {
      component.userBookings = mockBookings;
    });

    it('should check if user has booked event', () => {
      mockEventUtils.hasUserBookedEvent.and.returnValue(true);

      const result = component.hasUserBookedEvent('1');

      expect(result).toBe(true);
      expect(mockEventUtils.hasUserBookedEvent).toHaveBeenCalledWith(
        '1',
        mockBookings
      );
    });

    it('should get booking button text', () => {
      mockEventUtils.getBookingButtonText.and.returnValue('Cancel Booking');

      const result = component.getBookingButtonText(mockEvent);

      expect(result).toBe('Cancel Booking');
      expect(mockEventUtils.getBookingButtonText).toHaveBeenCalledWith(
        mockEvent,
        mockBookings
      );
    });

    it('should check if booking button is disabled', () => {
      mockEventUtils.isBookingButtonDisabled.and.returnValue(true);

      const result = component.isBookingButtonDisabled(mockEvent);

      expect(result).toBe(true);
      expect(mockEventUtils.isBookingButtonDisabled).toHaveBeenCalledWith(
        mockEvent,
        mockBookings
      );
    });

    it('should check if booking button is disabled when booking in progress', () => {
      mockEventUtils.isBookingButtonDisabled.and.returnValue(false);
      component.bookingLoadingStates.set({ '1': true });

      const result = component.isBookingButtonDisabled(mockEvent);

      expect(result).toBe(true);
    });

    it('should check if booking is in progress', () => {
      component.bookingLoadingStates.set({ '1': true });

      const result = component.isBookingInProgress('1');

      expect(result).toBe(true);
    });

    it('should return false when booking is not in progress', () => {
      const result = component.isBookingInProgress('999');

      expect(result).toBe(false);
    });
  });

  describe('Statistics Methods', () => {
    beforeEach(() => {
      component.filteredEvents = mockEvents;
      mockEventUtils.getAvailableSeats.and.returnValue(50);
    });

    it('should get available events count', () => {
      const result = component.getAvailableEventsCount();

      expect(result).toBe(3);
      expect(mockEventUtils.getAvailableSeats).toHaveBeenCalledTimes(3);
    });

    it('should get available events count when no available seats', () => {
      mockEventUtils.getAvailableSeats.and.returnValue(0);

      const result = component.getAvailableEventsCount();

      expect(result).toBe(0);
    });

    it('should get free events count', () => {
      const result = component.getFreeEventsCount();

      expect(result).toBe(1);
    });

    it('should get total available seats', () => {
      const result = component.getTotalAvailableSeats();

      expect(result).toBe(150);
      expect(mockEventUtils.getAvailableSeats).toHaveBeenCalledTimes(3);
    });
  });

  describe('Loading States', () => {
    it('should set booking loading state', () => {
      component['setBookingLoading']('1', true);

      expect(component.bookingLoadingStates()['1']).toBe(true);
    });

    it('should update existing booking loading state', () => {
      component.bookingLoadingStates.set({ '1': true });

      component['setBookingLoading']('2', true);

      expect(component.bookingLoadingStates()['1']).toBe(true);
      expect(component.bookingLoadingStates()['2']).toBe(true);
    });
  });
});
