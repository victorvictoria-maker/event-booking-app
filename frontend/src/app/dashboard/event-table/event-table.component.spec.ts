import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventTableComponent } from './event-table.component';
import { EventUtilsService } from '../../utils/eventUtility';
import { mockEvent } from '../../test/mock-data';
import { MockEventUtilsService } from '../../test/mock-event-utils.service';

describe('EventTableComponent', () => {
  let component: EventTableComponent;
  let fixture: ComponentFixture<EventTableComponent>;
  let mockEventUtils: MockEventUtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTableComponent],
      providers: [
        { provide: EventUtilsService, useClass: MockEventUtilsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EventTableComponent);
    component = fixture.componentInstance;
    mockEventUtils = TestBed.inject(
      EventUtilsService
    ) as unknown as MockEventUtilsService;

    component.events = [mockEvent];
    component.bookingLoadingStates = { '1': true };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Output Emitters', () => {
    it('should emit editEvent', () => {
      spyOn(component.editEvent, 'emit');
      component.onEditEvent(mockEvent);
      expect(component.editEvent.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit deleteEvent after confirm', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      spyOn(component.deleteEvent, 'emit');
      component.onDeleteEvent('1');
      expect(component.deleteEvent.emit).toHaveBeenCalledWith('1');
    });

    it('should NOT emit deleteEvent if confirm is false', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      spyOn(component.deleteEvent, 'emit');
      component.onDeleteEvent('1');
      expect(component.deleteEvent.emit).not.toHaveBeenCalled();
    });

    it('should emit toggleEventStatus', () => {
      spyOn(component.toggleEventStatus, 'emit');
      component.onToggleEventStatus('1');
      expect(component.toggleEventStatus.emit).toHaveBeenCalledWith('1');
    });

    it('should emit bookEvent', () => {
      spyOn(component.bookEvent, 'emit');
      component.onBookEvent(mockEvent);
      expect(component.bookEvent.emit).toHaveBeenCalledWith(mockEvent);
    });

    it('should emit viewEvent', () => {
      spyOn(component.viewEvent, 'emit');
      component.onViewEvent(mockEvent);
      expect(component.viewEvent.emit).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Utility Wrappers', () => {
    it('should call getAvailableSeats', () => {
      const result = component.getAvailableSeats(mockEvent);
      expect(result).toBe(20);
      expect(mockEventUtils.getAvailableSeats).toHaveBeenCalledWith(mockEvent);
    });

    it('should call getEventStatusBadgeClass', () => {
      const result = component.getEventStatusBadgeClass('active');
      expect(result).toBe('bg-success');
    });

    it('should call getBookingPercentage', () => {
      expect(component.getBookingPercentage(mockEvent)).toBe(50);
    });

    it('should call formatPrice', () => {
      expect(component.formatPrice(mockEvent)).toBe('₦1,000');
    });

    it('should call isEventBookable', () => {
      expect(component.isEventBookable(mockEvent)).toBeTrue();
    });

    it('should call getEventStatusText', () => {
      expect(component.getEventStatusText(mockEvent)).toBe('active');
    });

    it('should call hasUserBookedEvent', () => {
      expect(component.hasUserBookedEvent('1')).toBeFalse();
    });

    it('should call getBookingButtonText', () => {
      expect(component.getBookingButtonText(mockEvent)).toBe('Book');
    });

    it('should call isBookingButtonDisabled', () => {
      spyOn(component, 'isBookingInProgress').and.returnValue(true);
      expect(component.isBookingButtonDisabled(mockEvent)).toBeTrue();
    });

    it('should call getBookingButtonClass', () => {
      expect(component.getBookingButtonClass(mockEvent)).toBe(
        'btn btn-primary'
      );
    });

    it('should return booking in progress state', () => {
      expect(component.isBookingInProgress('1')).toBeTrue();
      expect(component.isBookingInProgress('2')).toBeFalse();
    });

    it('should call isEventPast', () => {
      expect(component.isEventPast(mockEvent)).toBeFalse();
    });
  });
});
