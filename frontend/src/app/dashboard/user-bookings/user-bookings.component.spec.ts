import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserBookingsComponent } from './user-bookings.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';
import { EventUtilsService } from '../../utils/eventUtility';
import { of, throwError } from 'rxjs';
import { mockBooking, mockBooking2, mockBooking3 } from '../../test/mock-data';

describe('UserBookingsComponent', () => {
  let component: UserBookingsComponent;
  let fixture: ComponentFixture<UserBookingsComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockBookingService: jasmine.SpyObj<BookingService>;
  let mockEventUtilsService: jasmine.SpyObj<EventUtilsService>;

  const mockUserBookingsResponse = {
    data: {
      bookings: [
        {
          ...mockBooking,
          event: { ...mockBooking.event, status: 'active' },
        },
        {
          ...mockBooking2,
          event: { ...mockBooking2.event, status: 'completed' },
        },
        {
          ...mockBooking3,
          event: { ...mockBooking3.event, status: 'active' },
        },
      ],
    },
  };

  const mockEmptyUserBookingsResponse = {
    data: {
      bookings: [],
    },
  };

  const mockCancelBookingResponse = {
    success: true,
    message: 'Booking cancelled successfully',
  };

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    mockBookingService = jasmine.createSpyObj('BookingService', [
      'getUserBookings',
      'cancelBooking',
    ]);

    mockEventUtilsService = jasmine.createSpyObj('EventUtilsService', [
      'getEventStatusBadgeClass',
    ]);

    await TestBed.configureTestingModule({
      imports: [UserBookingsComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: BookingService, useValue: mockBookingService },
        { provide: EventUtilsService, useValue: mockEventUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBookingsComponent);
    component = fixture.componentInstance;

    mockBookingService.getUserBookings.and.returnValue(
      of(mockUserBookingsResponse)
    );
    mockBookingService.cancelBooking.and.returnValue(
      of(mockCancelBookingResponse)
    );
    mockEventUtilsService.getEventStatusBadgeClass.and.returnValue(
      'badge bg-primary'
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all user bookings on init', () => {
      spyOn(component, 'loadAllUserBookings');

      component.ngOnInit();

      expect(component.loadAllUserBookings).toHaveBeenCalled();
    });
  });

  describe('loadAllUserBookings', () => {
    it('should load user bookings successfully', () => {
      component.loadAllUserBookings();

      expect(component.isLoading()).toBe(false);
      expect(component.allBookings.length).toBe(3);
      expect(component.upcomingBookings.length).toBe(2);
      expect(component.completedBookings.length).toBe(1);
      expect(component.bookingStats.totalBookings).toBe(3);
      expect(component.bookingStats.upcomingBookings).toBe(2);
      expect(component.bookingStats.completedBookings).toBe(1);
      expect(mockBookingService.getUserBookings).toHaveBeenCalledWith(1, 1000);
    });

    it('should handle loading error', () => {
      const errorMessage = 'Failed to load bookings';
      mockBookingService.getUserBookings.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadAllUserBookings();

      expect(component.isLoading()).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load bookings: ' + errorMessage
      );
    });

    it('should handle empty bookings response', () => {
      mockBookingService.getUserBookings.and.returnValue(
        of(mockEmptyUserBookingsResponse)
      );

      component.loadAllUserBookings();

      expect(component.allBookings).toEqual([]);
      expect(component.upcomingBookings).toEqual([]);
      expect(component.completedBookings).toEqual([]);
      expect(component.bookingStats.totalBookings).toBe(0);
    });
  });

  describe('categorizeBookings', () => {
    beforeEach(() => {
      component.allBookings = mockUserBookingsResponse.data.bookings as any;
    });

    it('should categorize bookings into upcoming and completed', () => {
      (component as any).categorizeBookings();

      expect(component.upcomingBookings.length).toBe(2);
      expect(component.completedBookings.length).toBe(1);
      expect(
        component.upcomingBookings.every((b) => b.event.status === 'active')
      ).toBe(true);
      expect(
        component.completedBookings.every((b) => b.event.status === 'completed')
      ).toBe(true);
    });
  });

  describe('calculateStats', () => {
    beforeEach(() => {
      component.allBookings = mockUserBookingsResponse.data.bookings as any;
      component.upcomingBookings =
        mockUserBookingsResponse.data.bookings.filter(
          (b) => b.event.status === 'active'
        ) as any;
      component.completedBookings =
        mockUserBookingsResponse.data.bookings.filter(
          (b) => b.event.status === 'completed'
        ) as any;
    });

    it('should calculate stats correctly', () => {
      (component as any).calculateStats();

      expect(component.bookingStats.totalBookings).toBe(3);
      expect(component.bookingStats.upcomingBookings).toBe(2);
      expect(component.bookingStats.completedBookings).toBe(1);
    });
  });

  describe('filterUpcomingBookings', () => {
    beforeEach(() => {
      component.upcomingBookings = [
        {
          ...mockBooking,
          event: {
            ...mockBooking.event,
            status: 'active',
            category: 'networking',
          },
        },
        {
          ...mockBooking3,
          event: { ...mockBooking3.event, status: 'active', category: 'music' },
        },
      ] as any;
    });

    it('should filter by search term (event name)', () => {
      component.upcomingFilters.searchTerm = 'farming';

      component.filterUpcomingBookings();

      expect(component.filteredUpcomingBookings.length).toBe(1);
      expect(component.filteredUpcomingBookings[0].event.name).toContain(
        'Farming'
      );
    });

    it('should filter by search term (venue)', () => {
      component.upcomingFilters.searchTerm = 'kano';

      component.filterUpcomingBookings();

      expect(component.filteredUpcomingBookings.length).toBe(1);
      expect(component.filteredUpcomingBookings[0].event.venue).toContain(
        'Kano'
      );
    });

    it('should filter by search term (category)', () => {
      component.upcomingFilters.searchTerm = 'music';

      component.filterUpcomingBookings();

      expect(component.filteredUpcomingBookings.length).toBe(1);
      expect(component.filteredUpcomingBookings[0].event.category).toBe(
        'music'
      );
    });

    it('should filter by category', () => {
      component.upcomingFilters.category = 'networking';

      component.filterUpcomingBookings();

      expect(component.filteredUpcomingBookings.length).toBe(1);
      expect(component.filteredUpcomingBookings[0].event.category).toBe(
        'networking'
      );
    });

    it('should return all bookings when no filters applied', () => {
      component.upcomingFilters = { searchTerm: '', category: '' };

      component.filterUpcomingBookings();

      expect(component.filteredUpcomingBookings.length).toBe(2);
    });
  });

  describe('filterCompletedBookings', () => {
    beforeEach(() => {
      component.completedBookings = [
        {
          ...mockBooking2,
          event: {
            ...mockBooking2.event,
            status: 'completed',
            category: 'technology',
          },
        },
      ] as any;
    });

    it('should filter by search term (event name)', () => {
      component.completedFilters.searchTerm = 'tech';

      component.filterCompletedBookings();

      expect(component.filteredCompletedBookings.length).toBe(1);
      expect(component.filteredCompletedBookings[0].event.name).toContain(
        'Tech'
      );
    });

    it('should filter by search term (venue)', () => {
      component.completedFilters.searchTerm = 'lagos';

      component.filterCompletedBookings();

      expect(component.filteredCompletedBookings.length).toBe(1);
      expect(component.filteredCompletedBookings[0].event.venue).toContain(
        'Lagos'
      );
    });

    it('should filter by category (case insensitive)', () => {
      component.completedFilters.category = 'Technology';

      component.filterCompletedBookings();

      expect(component.filteredCompletedBookings.length).toBe(1);
      expect(
        component.filteredCompletedBookings[0].event.category.toLowerCase()
      ).toBe('technology');
    });

    it('should return empty when no matches', () => {
      component.completedFilters.searchTerm = 'nonexistent';

      component.filterCompletedBookings();

      expect(component.filteredCompletedBookings.length).toBe(0);
    });
  });

  describe('updatePagination', () => {
    beforeEach(() => {
      component.filteredUpcomingBookings = new Array(25).fill(mockBooking);
      component.filteredCompletedBookings = new Array(15).fill(mockBooking2);
      component.upcomingPaginationData.itemsPerPage = 10;
      component.completedPaginationData.itemsPerPage = 10;
    });

    it('should update upcoming pagination data', () => {
      component.upcomingPaginationData.currentPage = 1;

      (component as any).updatePagination();

      expect(component.upcomingPaginationData.totalItems).toBe(25);
      expect(component.upcomingPaginationData.totalPages).toBe(3);
      expect(component.upcomingPaginationData.hasNextPage).toBe(true);
      expect(component.upcomingPaginationData.hasPrevPage).toBe(false);
    });

    it('should update completed pagination data', () => {
      component.completedPaginationData.currentPage = 2;

      (component as any).updatePagination();

      expect(component.completedPaginationData.totalItems).toBe(15);
      expect(component.completedPaginationData.totalPages).toBe(2);
      expect(component.completedPaginationData.hasNextPage).toBe(false);
      expect(component.completedPaginationData.hasPrevPage).toBe(true);
    });
  });

  describe('onTabChange', () => {
    it('should change active tab to upcoming', () => {
      component.onTabChange('upcoming');

      expect(component.activeTab()).toBe('upcoming');
    });

    it('should change active tab to completed', () => {
      component.onTabChange('completed');
      expect(component.activeTab()).toBe('completed');
    });
  });

  describe('Filter Change Handlers', () => {
    beforeEach(() => {
      spyOn(component as any, 'applyFiltersAndPagination');
    });

    describe('onUpcomingFiltersChange', () => {
      it('should reset current page and apply filters', () => {
        component.upcomingPaginationData.currentPage = 3;

        component.onUpcomingFiltersChange();

        expect(component.upcomingPaginationData.currentPage).toBe(1);
        expect((component as any).applyFiltersAndPagination).toHaveBeenCalled();
      });
    });

    describe('onCompletedFiltersChange', () => {
      it('should reset current page and apply filters', () => {
        component.completedPaginationData.currentPage = 3;

        component.onCompletedFiltersChange();

        expect(component.completedPaginationData.currentPage).toBe(1);
        expect((component as any).applyFiltersAndPagination).toHaveBeenCalled();
      });
    });
  });

  describe('Clear Filter Handlers', () => {
    beforeEach(() => {
      spyOn(component, 'onUpcomingFiltersChange');
      spyOn(component, 'onCompletedFiltersChange');
    });

    describe('onClearUpcomingFilters', () => {
      it('should reset upcoming filters and trigger filter change', () => {
        component.upcomingFilters = { searchTerm: 'test', category: 'Music' };

        component.onClearUpcomingFilters();

        expect(component.upcomingFilters).toEqual({
          searchTerm: '',
          category: '',
        });
        expect(component.onUpcomingFiltersChange).toHaveBeenCalled();
      });
    });

    describe('onClearCompletedFilters', () => {
      it('should reset completed filters and trigger filter change', () => {
        component.completedFilters = { searchTerm: 'test', category: 'Music' };

        component.onClearCompletedFilters();

        expect(component.completedFilters).toEqual({
          searchTerm: '',
          category: '',
        });
        expect(component.onCompletedFiltersChange).toHaveBeenCalled();
      });
    });
  });

  describe('getCurrentFilters', () => {
    it('should return upcoming filters when active tab is upcoming', () => {
      component.activeTab.set('upcoming');
      component.upcomingFilters = { searchTerm: 'test', category: 'Music' };

      const filters = component.getCurrentFilters();

      expect(filters).toEqual(component.upcomingFilters);
    });

    it('should return completed filters when active tab is completed', () => {
      component.activeTab.set('completed');
      component.completedFilters = { searchTerm: 'test', category: 'Tech' };

      const filters = component.getCurrentFilters();

      expect(filters).toEqual(component.completedFilters);
    });
  });

  describe('getCurrentPaginationData', () => {
    it('should return upcoming pagination when active tab is upcoming', () => {
      component.activeTab.set('upcoming');

      const pagination = component.getCurrentPaginationData();

      expect(pagination).toEqual(component.upcomingPaginationData);
    });

    it('should return completed pagination when active tab is completed', () => {
      component.activeTab.set('completed');

      const pagination = component.getCurrentPaginationData();

      expect(pagination).toEqual(component.completedPaginationData);
    });
  });

  describe('getCurrentBookings', () => {
    beforeEach(() => {
      component.filteredUpcomingBookings = new Array(25).fill(mockBooking);
      component.filteredCompletedBookings = new Array(15).fill(mockBooking2);
    });

    it('should return paginated upcoming bookings when active tab is upcoming', () => {
      component.activeTab.set('upcoming');
      component.upcomingPaginationData.currentPage = 1;
      component.upcomingPaginationData.itemsPerPage = 10;

      const bookings = component.getCurrentBookings();

      expect(bookings.length).toBe(10);
    });

    it('should return paginated completed bookings when active tab is completed', () => {
      component.activeTab.set('completed');
      component.completedPaginationData.currentPage = 1;
      component.completedPaginationData.itemsPerPage = 10;

      const bookings = component.getCurrentBookings();

      expect(bookings.length).toBe(10);
    });
  });

  describe('onCancelBooking', () => {
    const testBooking = { ...mockBooking, _id: 'test-booking-id' } as any;

    it('should cancel booking successfully', () => {
      spyOn(component, 'loadAllUserBookings');

      component.onCancelBooking(testBooking);

      expect(component.isCancelling('test-booking-id')).toBe(false);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Booking cancelled successfully!'
      );
      expect(component.loadAllUserBookings).toHaveBeenCalled();
      expect(mockBookingService.cancelBooking).toHaveBeenCalledWith(
        'test-booking-id'
      );
    });

    it('should handle cancel booking error', () => {
      const errorMessage = 'Cancellation failed';
      mockBookingService.cancelBooking.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.onCancelBooking(testBooking);

      expect(component.isCancelling('test-booking-id')).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to cancel booking: ' + errorMessage
      );
    });
  });

  describe('setCancellingState', () => {
    it('should set cancelling state for booking', () => {
      (component as any).setCancellingState('booking-1', true);

      expect(component.isCancelling('booking-1')).toBe(true);
    });

    it('should clear cancelling state for booking', () => {
      (component as any).setCancellingState('booking-1', true);
      (component as any).setCancellingState('booking-1', false);

      expect(component.isCancelling('booking-1')).toBe(false);
    });
  });

  describe('isCancelling', () => {
    it('should return true when booking is cancelling', () => {
      (component as any).setCancellingState('booking-1', true);

      expect(component.isCancelling('booking-1')).toBe(true);
    });

    it('should return false when booking is not cancelling', () => {
      expect(component.isCancelling('booking-1')).toBe(false);
    });
  });

  describe('canCancelBooking', () => {
    it('should return true for active event booking', () => {
      const activeBooking = { event: { status: 'active' } } as any;

      const result = component.canCancelBooking(activeBooking);

      expect(result).toBe(true);
    });

    it('should return false for completed event booking', () => {
      const completedBooking = { event: { status: 'completed' } } as any;

      const result = component.canCancelBooking(completedBooking);

      expect(result).toBe(false);
    });

    it('should return false for cancelled event booking', () => {
      const cancelledBooking = { event: { status: 'cancelled' } } as any;

      const result = component.canCancelBooking(cancelledBooking);

      expect(result).toBe(false);
    });
  });

  describe('getStatusBadgeClass', () => {
    it('should return success class for paid status', () => {
      const result = component.getStatusBadgeClass('paid');

      expect(result).toBe('badge bg-success');
    });

    it('should return success class for PAID status (case insensitive)', () => {
      const result = component.getStatusBadgeClass('PAID');

      expect(result).toBe('badge bg-success');
    });

    it('should return default class for unknown status', () => {
      const result = component.getStatusBadgeClass('pending');

      expect(result).toBe('badge bg-light text-dark');
    });

    it('should return default class for empty status', () => {
      const result = component.getStatusBadgeClass('');

      expect(result).toBe('badge bg-light text-dark');
    });
  });

  describe('getEventStatusBadgeClass', () => {
    it('should call eventUtils service method', () => {
      const status = 'active';

      component.getEventStatusBadgeClass(status);

      expect(
        mockEventUtilsService.getEventStatusBadgeClass
      ).toHaveBeenCalledWith(status);
    });

    it('should return result from eventUtils service', () => {
      const expectedClass = 'badge bg-primary';
      mockEventUtilsService.getEventStatusBadgeClass.and.returnValue(
        expectedClass
      );

      const result = component.getEventStatusBadgeClass('active');

      expect(result).toBe(expectedClass);
    });
  });

  describe('Pagination Methods', () => {
    beforeEach(() => {
      spyOn(component as any, 'updatePagination');
    });

    describe('onPageChange', () => {
      it('should update upcoming page when active tab is upcoming', () => {
        component.activeTab.set('upcoming');

        component.onPageChange(3);

        expect(component.upcomingPaginationData.currentPage).toBe(3);
        expect((component as any).updatePagination).toHaveBeenCalled();
      });

      it('should update completed page when active tab is completed', () => {
        component.activeTab.set('completed');

        component.onPageChange(2);

        expect(component.completedPaginationData.currentPage).toBe(2);
        expect((component as any).updatePagination).toHaveBeenCalled();
      });
    });

    describe('onPreviousPage', () => {
      it('should go to previous page when has previous page', () => {
        spyOn(component, 'onPageChange');
        component.activeTab.set('upcoming');
        component.upcomingPaginationData.currentPage = 3;
        component.upcomingPaginationData.hasPrevPage = true;

        component.onPreviousPage();

        expect(component.onPageChange).toHaveBeenCalledWith(2);
      });

      it('should not change page when no previous page', () => {
        spyOn(component, 'onPageChange');
        component.activeTab.set('upcoming');
        component.upcomingPaginationData.currentPage = 1;
        component.upcomingPaginationData.hasPrevPage = false;

        component.onPreviousPage();

        expect(component.onPageChange).not.toHaveBeenCalled();
      });
    });

    describe('onNextPage', () => {
      it('should go to next page when has next page', () => {
        spyOn(component, 'onPageChange');
        component.activeTab.set('completed');
        component.completedPaginationData.currentPage = 1;
        component.completedPaginationData.hasNextPage = true;

        component.onNextPage();

        expect(component.onPageChange).toHaveBeenCalledWith(2);
      });

      it('should not change page when no next page', () => {
        spyOn(component, 'onPageChange');
        component.activeTab.set('completed');
        component.completedPaginationData.currentPage = 3;
        component.completedPaginationData.hasNextPage = false;

        component.onNextPage();

        expect(component.onPageChange).not.toHaveBeenCalled();
      });
    });
  });
});
