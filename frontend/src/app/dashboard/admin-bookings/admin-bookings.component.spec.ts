import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminBookingsComponent } from './admin-bookings.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BookingService } from '../../services/booking.service';
import { of, throwError } from 'rxjs';
import {
  mockBookings,
  mockBookingsPaginationResponse,
  mockEmptyBookingsPaginationResponse,
  mockLargeBookingsResponse,
  mockBooking,
} from '../../test/mock-data';

describe('AdminBookingsComponent', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockBookingService: jasmine.SpyObj<BookingService>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'warning',
    ]);

    mockBookingService = jasmine.createSpyObj('BookingService', [
      'getAllBookings',
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminBookingsComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: BookingService, useValue: mockBookingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;

    mockBookingService.getAllBookings.and.returnValue(
      of(mockBookingsPaginationResponse)
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load all bookings on init', () => {
      spyOn(component, 'loadAllBookings');

      component.ngOnInit();

      expect(component.loadAllBookings).toHaveBeenCalled();
    });
  });

  describe('loadAllBookings', () => {
    it('should load bookings successfully', () => {
      component.loadAllBookings();

      expect(component.isLoading()).toBe(false);
      expect(component.filteredBookings).toEqual(jasmine.any(Array));
      expect(component.filteredBookings.length).toBe(3);
      expect(component.filteredBookings[0]._id).toBe('booking1');
      expect(component.paginationData).toEqual({
        currentPage: 1,
        totalPages: 1,
        totalItems: 3,
        itemsPerPage: 10,
        hasNextPage: false,
        hasPrevPage: false,
      });
      expect(mockBookingService.getAllBookings).toHaveBeenCalledWith(1, 10);
    });

    it('should handle loading bookings error', () => {
      const errorMessage = 'Failed to load bookings';
      mockBookingService.getAllBookings.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadAllBookings();

      expect(component.isLoading()).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load bookings: ' + errorMessage
      );
    });

    it('should handle empty bookings response', () => {
      mockBookingService.getAllBookings.and.returnValue(
        of(mockEmptyBookingsPaginationResponse)
      );

      component.loadAllBookings();

      expect(component.filteredBookings).toEqual([]);
    });

    it('should load booking stats after loading bookings', () => {
      spyOn(component as any, 'loadBookingStats');

      component.loadAllBookings();

      expect((component as any).loadBookingStats).toHaveBeenCalled();
    });
  });

  describe('loadBookingStats', () => {
    it('should calculate stats correctly', () => {
      mockBookingService.getAllBookings.and.returnValue(
        of(mockLargeBookingsResponse)
      );

      (component as any).loadBookingStats();

      expect(component.bookingStats.totalBookings).toBe(5);
      expect(component.bookingStats.paidBookings).toBe(4);
      expect(component.bookingStats.totalRevenue).toBe(150);
    });

    it('should handle stats loading error', () => {
      const errorMessage = 'Stats loading failed';
      mockBookingService.getAllBookings.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );
      spyOn(console, 'error');

      (component as any).loadBookingStats();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load booking stats:',
        { message: errorMessage }
      );
    });
  });

  describe('calculateStats', () => {
    it('should calculate stats from all bookings', () => {
      component.allBookings = mockBookings as any;

      (component as any).calculateStats();

      expect(component.bookingStats.totalBookings).toBe(3);
      expect(component.bookingStats.paidBookings).toBe(3);
      expect(component.bookingStats.totalRevenue).toBe(125);
    });

    it('should handle empty bookings array', () => {
      component.allBookings = [];

      (component as any).calculateStats();

      expect(component.bookingStats.totalBookings).toBe(0);
      expect(component.bookingStats.paidBookings).toBe(0);
      expect(component.bookingStats.totalRevenue).toBe(0);
    });
  });

  describe('onFiltersChange', () => {
    it('should reset current page and load filtered bookings', () => {
      spyOn(component as any, 'loadFilteredBookings');
      component.paginationData.currentPage = 3;

      component.onFiltersChange();

      expect(component.paginationData.currentPage).toBe(1);
      expect((component as any).loadFilteredBookings).toHaveBeenCalled();
    });
  });

  describe('applyFilters', () => {
    beforeEach(() => {
      component.allBookings = mockBookings as any;
    });

    it('should filter by search term (event name)', () => {
      component.filters.searchTerm = 'farming';

      const filtered = (component as any).applyFilters(mockBookings);

      expect(filtered.length).toBe(1);
      expect(filtered[0].event.name).toContain('Farming');
    });

    it('should filter by search term (venue)', () => {
      component.filters.searchTerm = 'abuja';

      const filtered = (component as any).applyFilters(mockBookings);

      expect(filtered.length).toBe(1);
      expect(filtered[0].event.venue).toContain('Abuja');
    });

    it('should filter by search term (username)', () => {
      component.filters.searchTerm = 'vicky';

      const filtered = (component as any).applyFilters(mockBookings);

      expect(filtered.length).toBe(3);
    });

    it('should filter by category', () => {
      component.filters.category = 'Technology';

      const filtered = (component as any).applyFilters(mockBookings);

      expect(filtered.length).toBe(1);
      expect(filtered[0].event.category).toBe('technology');
    });

    it('should filter by event status', () => {
      const mockBookingsWithStatus = [
        {
          ...mockBookings[0],
          event: { ...mockBookings[0].event, status: 'active' },
        },
        {
          ...mockBookings[1],
          event: { ...mockBookings[1].event, status: 'cancelled' },
        },
      ];
      component.filters.eventStatus = 'active';

      const filtered = (component as any).applyFilters(mockBookingsWithStatus);

      expect(filtered.length).toBe(1);
      expect(filtered[0].event.status).toBe('active');
    });

    it('should return empty array when no matches', () => {
      component.filters.searchTerm = 'nonexistent';

      const filtered = (component as any).applyFilters(mockBookings);

      expect(filtered.length).toBe(0);
    });
  });

  describe('onClearFilters', () => {
    it('should reset filters and reload bookings', () => {
      spyOn(component, 'loadAllBookings');
      component.filters = {
        searchTerm: 'test',
        category: 'Music',
        eventStatus: 'active',
      };
      component.paginationData.currentPage = 3;

      component.onClearFilters();

      expect(component.filters).toEqual({
        searchTerm: '',
        category: '',
        eventStatus: '',
      });
      expect(component.paginationData.currentPage).toBe(1);
      expect(component.loadAllBookings).toHaveBeenCalled();
    });
  });

  describe('loadFilteredBookings', () => {
    it('should call loadAllBookingsWithFilters and set loading state', () => {
      spyOn(component as any, 'loadAllBookingsWithFilters');

      (component as any).loadFilteredBookings();

      expect(component.isLoading()).toBe(true);
      expect((component as any).loadAllBookingsWithFilters).toHaveBeenCalled();
    });
  });

  describe('loadAllBookingsWithFilters', () => {
    beforeEach(() => {
      spyOn(component as any, 'applyFilters').and.returnValue(mockBookings);
      component.paginationData.itemsPerPage = 10;
      component.paginationData.currentPage = 1;
    });

    it('should load and filter bookings successfully', () => {
      mockBookingService.getAllBookings.and.returnValue(
        of(mockLargeBookingsResponse)
      );

      (component as any).loadAllBookingsWithFilters();

      expect(mockBookingService.getAllBookings).toHaveBeenCalledWith(1, 1000);
      expect((component as any).applyFilters).toHaveBeenCalledWith(
        mockLargeBookingsResponse.data.bookings
      );
      expect(component.filteredBookings).toEqual(mockBookings as any);
      expect(component.isLoading()).toBe(false);
    });

    it('should handle error when loading filtered bookings', () => {
      const errorMessage = 'Failed to load filtered bookings';
      mockBookingService.getAllBookings.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      (component as any).loadAllBookingsWithFilters();

      expect(component.isLoading()).toBe(false);
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load bookings: ' + errorMessage
      );
    });
  });

  describe('getCurrentPageBookings', () => {
    it('should return filtered bookings', () => {
      component.filteredBookings = mockBookings as any;

      const result = component.getCurrentPageBookings();

      expect(result).toEqual(mockBookings as any);
    });

    it('should return empty array when no filtered bookings', () => {
      component.filteredBookings = [];

      const result = component.getCurrentPageBookings();

      expect(result).toEqual([]);
    });
  });

  describe('Pagination Methods', () => {
    beforeEach(() => {
      spyOn(component, 'loadAllBookings');
      spyOn(component as any, 'loadFilteredBookings');
    });

    describe('onPageChange', () => {
      it('should load all bookings when no active filters', () => {
        spyOn(component as any, 'hasActiveFilters').and.returnValue(false);

        component.onPageChange(2);

        expect(component.paginationData.currentPage).toBe(2);
        expect(component.loadAllBookings).toHaveBeenCalled();
        expect((component as any).loadFilteredBookings).not.toHaveBeenCalled();
      });

      it('should load filtered bookings when has active filters', () => {
        spyOn(component as any, 'hasActiveFilters').and.returnValue(true);

        component.onPageChange(2);

        expect(component.paginationData.currentPage).toBe(2);
        expect((component as any).loadFilteredBookings).toHaveBeenCalled();
        expect(component.loadAllBookings).not.toHaveBeenCalled();
      });
    });

    describe('onPreviousPage', () => {
      it('should go to previous page when has previous page', () => {
        component.paginationData.hasPrevPage = true;
        component.paginationData.currentPage = 3;
        spyOn(component, 'onPageChange');

        component.onPreviousPage();

        expect(component.onPageChange).toHaveBeenCalledWith(2);
      });
    });

    describe('onNextPage', () => {
      it('should go to next page when has next page', () => {
        component.paginationData.hasNextPage = true;
        component.paginationData.currentPage = 1;
        spyOn(component, 'onPageChange');

        component.onNextPage();

        expect(component.onPageChange).toHaveBeenCalledWith(2);
      });
    });
  });

  describe('hasActiveFilters', () => {
    it('should return true when search term is active', () => {
      component.filters.searchTerm = 'test';

      const result = (component as any).hasActiveFilters();

      expect(result).toBe(true);
    });

    it('should return true when category is active', () => {
      component.filters.category = 'Music';

      const result = (component as any).hasActiveFilters();

      expect(result).toBe(true);
    });

    it('should return true when event status is active', () => {
      component.filters.eventStatus = 'active';

      const result = (component as any).hasActiveFilters();

      expect(result).toBe(true);
    });

    it('should return false when no filters are active', () => {
      component.filters = {
        searchTerm: '',
        category: '',
        eventStatus: '',
      };

      const result = (component as any).hasActiveFilters();

      expect(result).toBe(false);
    });

    it('should return false when search term is only whitespace', () => {
      component.filters.searchTerm = '   ';

      const result = (component as any).hasActiveFilters();

      expect(result).toBe(false);
    });
  });

  describe('onContactUser', () => {
    it('should open mailto link', () => {
      spyOn(window, 'open');
      const user = { username: 'testuser', email: 'test@example.com' };

      component.onContactUser(user);

      expect(window.open).toHaveBeenCalledWith(
        jasmine.stringContaining('mailto:test@example.com'),
        '_blank'
      );
    });
  });

  describe('onViewBookingDetails', () => {
    let mockModalElement: HTMLElement;
    let mockModal: any;

    beforeEach(() => {
      mockModal = {
        show: jasmine.createSpy('show'),
      };

      mockModalElement = document.createElement('div');
      mockModalElement.id = 'bookingDetailsModal';

      spyOn(document, 'getElementById').and.returnValue(mockModalElement);

      (window as any).bootstrap = {
        Modal: jasmine.createSpy('Modal').and.returnValue(mockModal),
      };
    });

    it('should set selected booking and show modal', () => {
      const booking = mockBooking as any;

      component.onViewBookingDetails(booking);

      expect(component.selectedBooking).toEqual(booking);
      expect(document.getElementById).toHaveBeenCalledWith(
        'bookingDetailsModal'
      );
      expect((window as any).bootstrap.Modal).toHaveBeenCalledWith(
        mockModalElement
      );
      expect(mockModal.show).toHaveBeenCalled();
    });

    it('should handle case when modal element is not found', () => {
      const booking = mockBooking as any;
      (document.getElementById as jasmine.Spy).and.returnValue(null);

      component.onViewBookingDetails(booking);

      expect(component.selectedBooking).toEqual(booking);
      expect(document.getElementById).toHaveBeenCalledWith(
        'bookingDetailsModal'
      );
      expect((window as any).bootstrap.Modal).not.toHaveBeenCalled();
      expect(mockModal.show).not.toHaveBeenCalled();
    });
  });

  describe('onExportBooking', () => {
    let mockLink: any;
    let mockBlob: any;
    let mockURL: any;

    beforeEach(() => {
      mockLink = {
        href: '',
        download: '',
        click: jasmine.createSpy('click'),
      };
      mockBlob = new Blob(['test'], { type: 'text/csv' });
      mockURL = 'blob:mock-url';

      spyOn(document, 'createElement').and.returnValue(mockLink);
      spyOn(window.URL, 'createObjectURL').and.returnValue(mockURL);
      spyOn(window.URL, 'revokeObjectURL');
      spyOn(component as any, 'generateBookingCSV').and.returnValue('csv,data');
      spyOn(window, 'Blob').and.returnValue(mockBlob);
    });

    it('should export single booking successfully', () => {
      const booking = mockBooking as any;

      component.onExportBooking(booking);

      expect((component as any).generateBookingCSV).toHaveBeenCalledWith([
        booking,
      ]);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(
        jasmine.any(Object)
      );
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.href).toBe(mockURL);
      expect(mockLink.download).toBe(`booking-${booking._id.slice(-8)}.csv`);
      expect(mockLink.click).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(mockURL);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Booking data exported successfully'
      );
    });

    it('should handle booking with short ID', () => {
      const bookingWithShortId = { ...mockBooking, _id: '123' };

      component.onExportBooking(bookingWithShortId as any);

      expect(mockLink.download).toBe('booking-123.csv');
    });

    it('should handle CSV generation error', () => {
      const booking = mockBooking as any;
      (component as any).generateBookingCSV = jasmine
        .createSpy('generateBookingCSV')
        .and.throwError('CSV generation failed');

      expect(() => component.onExportBooking(booking)).toThrow();
    });
  });

  describe('Export Methods', () => {
    beforeEach(() => {
      spyOn(window.URL, 'createObjectURL').and.returnValue('blob:url');
      spyOn(window.URL, 'revokeObjectURL');

      const mockLink = {
        href: '',
        download: '',
        click: jasmine.createSpy('click'),
      };
      spyOn(document, 'createElement').and.returnValue(mockLink as any);
    });

    describe('onExportAllBookings', () => {
      it('should export all bookings when no filters active', () => {
        component.allBookings = mockBookings as any;
        spyOn(component as any, 'hasActiveFilters').and.returnValue(false);
        spyOn(component as any, 'generateBookingCSV').and.returnValue(
          'csv,data'
        );

        component.onExportAllBookings();

        expect((component as any).generateBookingCSV).toHaveBeenCalledWith(
          mockBookings
        );
        expect(mockToastrService.success).toHaveBeenCalledWith(
          '3 bookings exported successfully'
        );
      });

      it('should export filtered bookings when filters are active', () => {
        component.allBookings = mockBookings as any;
        spyOn(component as any, 'hasActiveFilters').and.returnValue(true);
        spyOn(component as any, 'applyFilters').and.returnValue([
          mockBookings[0],
        ]);
        spyOn(component as any, 'generateBookingCSV').and.returnValue(
          'csv,data'
        );

        component.onExportAllBookings();

        expect((component as any).applyFilters).toHaveBeenCalledWith(
          mockBookings
        );
        expect((component as any).generateBookingCSV).toHaveBeenCalledWith([
          mockBookings[0],
        ]);
        expect(mockToastrService.success).toHaveBeenCalledWith(
          '1 bookings exported successfully'
        );
      });

      it('should show warning when no bookings data available', () => {
        component.allBookings = [];

        component.onExportAllBookings();

        expect(mockToastrService.warning).toHaveBeenCalledWith(
          'No bookings data available. Please wait for data to load.'
        );
      });

      it('should show warning when no bookings to export after filtering', () => {
        component.allBookings = mockBookings as any;
        spyOn(component as any, 'hasActiveFilters').and.returnValue(true);
        spyOn(component as any, 'applyFilters').and.returnValue([]);

        component.onExportAllBookings();

        expect(mockToastrService.warning).toHaveBeenCalledWith(
          'No bookings to export'
        );
      });

      it('should handle export error', () => {
        component.allBookings = mockBookings as any;
        spyOn(component as any, 'hasActiveFilters').and.returnValue(false);
        spyOn(component as any, 'generateBookingCSV').and.throwError(
          'Export failed'
        );
        spyOn(console, 'error');

        component.onExportAllBookings();

        expect(mockToastrService.error).toHaveBeenCalledWith(
          'Failed to export bookings'
        );
        expect(console.error).toHaveBeenCalledWith(
          'Export error:',
          jasmine.any(Error)
        );
      });
    });

    describe('generateBookingCSV', () => {
      it('should generate CSV with correct headers and data', () => {
        const result = (component as any).generateBookingCSV([mockBooking]);

        expect(result).toContain('Booking ID,User Name,User Email');
        expect(result).toContain('booking1,"vicky",vee@gmail.com');
        expect(result).toContain('"Farming Festival"');
      });

      it('should handle empty bookings array', () => {
        const result = (component as any).generateBookingCSV([]);

        const lines = result.split('\n');
        expect(lines.length).toBe(1);
        expect(lines[0]).toContain('Booking ID,User Name,User Email');
      });
    });
  });

  describe('Badge Class Methods', () => {
    describe('getPaymentStatusBadgeClass', () => {
      it('should return correct class for paid status', () => {
        const result = component.getPaymentStatusBadgeClass('paid');
        expect(result).toBe('badge bg-success');
      });

      it('should return correct class for pending status', () => {
        const result = component.getPaymentStatusBadgeClass('pending');
        expect(result).toBe('badge bg-warning');
      });

      it('should return correct class for failed status', () => {
        const result = component.getPaymentStatusBadgeClass('failed');
        expect(result).toBe('badge bg-danger');
      });

      it('should return correct class for refunded status', () => {
        const result = component.getPaymentStatusBadgeClass('refunded');
        expect(result).toBe('badge bg-secondary');
      });

      it('should return default class for unknown status', () => {
        const result = component.getPaymentStatusBadgeClass('unknown');
        expect(result).toBe('badge bg-light text-dark');
      });
    });

    describe('getEventStatusBadgeClass', () => {
      it('should return correct class for active status', () => {
        const result = component.getEventStatusBadgeClass('active');
        expect(result).toBe('badge bg-primary');
      });

      it('should return correct class for cancelled status', () => {
        const result = component.getEventStatusBadgeClass('cancelled');
        expect(result).toBe('badge bg-danger');
      });

      it('should return correct class for completed status', () => {
        const result = component.getEventStatusBadgeClass('completed');
        expect(result).toBe('badge bg-secondary');
      });

      it('should return default class for unknown status', () => {
        const result = component.getEventStatusBadgeClass('unknown');
        expect(result).toBe('badge bg-light text-dark');
      });
    });
  });
});
