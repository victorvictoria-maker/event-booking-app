import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEventManagementComponent } from './admin-event-management.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { EventModalComponent } from '../event-modal/event-modal.component';
import { EventFilters } from '../../models/event.model';
import {
  mockEvent,
  mockEvents,
  mockPaginationData,
  mockEventsResponse,
  mockEmptyEventsResponse,
  mockEventStats,
  mockCreateEventResponse,
  mockUpdateEventResponse,
  mockDeleteEventResponse,
  mockToggleStatusResponse,
} from '../../test/mock-data';

describe('AdminEventManagementComponent', () => {
  let component: AdminEventManagementComponent;
  let fixture: ComponentFixture<AdminEventManagementComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockEventService: jasmine.SpyObj<EventService>;
  let mockBookingService: jasmine.SpyObj<BookingService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
      'warning',
    ]);

    mockEventService = jasmine.createSpyObj('EventService', [
      'getAllEvents',
      'getEventStats',
      'createEvent',
      'updateEvent',
      'deleteEvent',
      'toggleEventStatus',
    ]);

    mockBookingService = jasmine.createSpyObj('BookingService', [
      'getUserBookings',
    ]);

    mockModalService = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      imports: [AdminEventManagementComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: EventService, useValue: mockEventService },
        { provide: BookingService, useValue: mockBookingService },
        { provide: NgbModal, useValue: mockModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventManagementComponent);
    component = fixture.componentInstance;

    mockEventService.getAllEvents.and.returnValue(of(mockEventsResponse));
    mockEventService.getEventStats.and.returnValue(of(mockEventStats));
  });

  describe('ngOnInit', () => {
    it('should load events and event stats on init', () => {
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadEventStats');

      component.ngOnInit();

      expect(component.loadEvents).toHaveBeenCalled();
      expect(component.loadEventStats).toHaveBeenCalled();
    });
  });

  describe('loadEvents', () => {
    it('should load events successfully', () => {
      component.loadEvents();

      expect(component.isLoading()).toBe(false);
      expect(component.events).toEqual(mockEvents);
      expect(component.filteredEvents).toEqual(mockEvents);
      expect(component.paginationData).toEqual(mockPaginationData);
      expect(component.eventStats.totalEvents).toBe(
        mockPaginationData.totalItems
      );
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
        'Failed to load user bookings: ' + errorMessage
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

    it('should load events for specific page', () => {
      component.loadEvents(3);

      expect(component.paginationData.currentPage).toBe(3);
      expect(mockEventService.getAllEvents).toHaveBeenCalledWith(
        component.filters,
        3,
        10
      );
    });
  });

  describe('loadEventStats', () => {
    it('should load event stats successfully', () => {
      component.loadEventStats();

      expect(component.eventStats).toEqual({
        totalEvents: 10,
        activeEvents: 8,
        totalBookings: 25,
        availableSeats: 150,
      });
      expect(mockEventService.getEventStats).toHaveBeenCalled();
    });

    it('should handle event stats loading error', () => {
      const errorMessage = 'Failed to load stats';
      mockEventService.getEventStats.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );
      spyOn(console, 'error');

      component.loadEventStats();

      expect(console.error).toHaveBeenCalledWith(
        'Failed to load event statistics:',
        errorMessage
      );
      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load statistics: ' + errorMessage
      );
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

      expect(component.filters).toEqual(newFilters);
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
        status: '',
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

  describe('openCreateEventModal', () => {
    it('should open create event modal correctly', () => {
      const mockModalRef = {
        componentInstance: {
          isEditMode: false,
          categories: component.categories,
          eventSubmit: {
            subscribe: jasmine
              .createSpy('subscribe')
              .and.callFake((callback: any) => {
                callback(mockEvent);
              }),
          },
        },
      };
      mockModalService.open.and.returnValue(mockModalRef as any);
      spyOn(component, 'createEvent');

      component.openCreateEventModal();

      expect(mockModalService.open).toHaveBeenCalledWith(EventModalComponent, {
        size: 'lg',
        centered: true,
      });
      expect(mockModalRef.componentInstance.isEditMode).toBe(false);
      expect(mockModalRef.componentInstance.categories).toBe(
        component.categories
      );
      expect(component.createEvent).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('openEditEventModal', () => {
    it('should open edit event modal correctly', () => {
      const mockModalRef = {
        componentInstance: {
          event: mockEvent,
          isEditMode: true,
          categories: component.categories,
          eventSubmit: {
            subscribe: jasmine
              .createSpy('subscribe')
              .and.callFake((callback: any) => {
                callback(mockEvent);
              }),
          },
        },
      };
      mockModalService.open.and.returnValue(mockModalRef as any);
      spyOn(component, 'updateEvent');

      component.openEditEventModal(mockEvent);

      expect(mockModalService.open).toHaveBeenCalledWith(EventModalComponent, {
        size: 'lg',
        centered: true,
      });
      expect(mockModalRef.componentInstance.event).toBe(mockEvent);
      expect(mockModalRef.componentInstance.isEditMode).toBe(true);
      expect(mockModalRef.componentInstance.categories).toBe(
        component.categories
      );
      expect(component.updateEvent).toHaveBeenCalledWith(mockEvent);
    });

    it('should not open modal for completed events and show warning', () => {
      const completedEvent = {
        ...mockEvent,
        status: 'completed' as 'completed',
      };

      component.openEditEventModal(completedEvent);

      expect(mockToastrService.warning).toHaveBeenCalledWith(
        'Completed events cannot be edited'
      );
      expect(mockModalService.open).not.toHaveBeenCalled();
    });
  });

  describe('createEvent', () => {
    it('should create event successfully', () => {
      mockEventService.createEvent.and.returnValue(of(mockCreateEventResponse));
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadEventStats');

      component.createEvent(mockEvent);

      expect(mockEventService.createEvent).toHaveBeenCalledWith(mockEvent);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Event created successfully!'
      );
      expect(component.loadEvents).toHaveBeenCalled();
      expect(component.loadEventStats).toHaveBeenCalled();
    });

    it('should handle create event error', () => {
      const errorMessage = 'Creation failed';
      mockEventService.createEvent.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.createEvent(mockEvent);

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to create event:',
        errorMessage
      );
    });
  });

  describe('updateEvent', () => {
    it('should update event successfully', () => {
      mockEventService.updateEvent.and.returnValue(of(mockUpdateEventResponse));
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadEventStats');

      component.updateEvent(mockEvent);

      expect(mockEventService.updateEvent).toHaveBeenCalledWith(mockEvent);
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Event updated successfully!'
      );
      expect(component.loadEvents).toHaveBeenCalled();
      expect(component.loadEventStats).toHaveBeenCalled();
    });

    it('should handle update event error', () => {
      const errorMessage = 'Update failed';
      mockEventService.updateEvent.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.updateEvent(mockEvent);

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to update event:',
        errorMessage
      );
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', () => {
      mockEventService.deleteEvent.and.returnValue(of(mockDeleteEventResponse));
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadEventStats');

      component.deleteEvent('1');

      expect(mockEventService.deleteEvent).toHaveBeenCalledWith('1');
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Event deleted successfully!'
      );
      expect(component.loadEvents).toHaveBeenCalled();
      expect(component.loadEventStats).toHaveBeenCalled();
    });

    it('should handle delete event error', () => {
      const errorMessage = 'Delete failed';
      mockEventService.deleteEvent.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.deleteEvent('1');

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to delete event: ' + errorMessage
      );
    });
  });

  describe('toggleEventStatus', () => {
    beforeEach(() => {
      component.events = mockEvents;
    });

    it('should toggle event status successfully', () => {
      mockEventService.toggleEventStatus.and.returnValue(
        of(mockToggleStatusResponse)
      );
      spyOn(component, 'loadEvents');
      spyOn(component, 'loadEventStats');

      component.toggleEventStatus('1');

      expect(mockEventService.toggleEventStatus).toHaveBeenCalledWith('1');
      expect(mockToastrService.success).toHaveBeenCalledWith(
        'Event status updated successfully!'
      );
      expect(component.loadEvents).toHaveBeenCalled();
      expect(component.loadEventStats).toHaveBeenCalled();
    });

    it('should not toggle status for completed events and show warning', () => {
      const completedEvent = {
        ...mockEvent,
        status: 'completed' as 'completed',
      };
      component.events = [completedEvent];

      component.toggleEventStatus('1');

      expect(mockToastrService.warning).toHaveBeenCalledWith(
        'Completed events cannot have their status changed'
      );
      expect(mockEventService.toggleEventStatus).not.toHaveBeenCalled();
    });

    it('should handle toggle status error', () => {
      const errorMessage = 'Toggle failed';
      mockEventService.toggleEventStatus.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.toggleEventStatus('1');

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to update event status: ' + errorMessage
      );
    });
  });
});
