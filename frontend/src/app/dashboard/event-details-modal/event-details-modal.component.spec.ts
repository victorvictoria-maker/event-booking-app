import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsModalComponent } from './event-details-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EventUtilsService } from '../../utils/eventUtility';
import { Event } from '../../models/event.model';

describe('EventDetailsModalComponent', () => {
  let component: EventDetailsModalComponent;
  let fixture: ComponentFixture<EventDetailsModalComponent>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;
  let mockEventUtils: jasmine.SpyObj<EventUtilsService>;

  // Mock event data
  const mockEvent: Event = {
    _id: '123',
    id: '123',
    time: '10-12',
    name: 'Test Event',
    description: 'Test Description',
    date: '2025-04-22T00:00:00.000Z',
    totalSeats: 100,
    availableSeats: 40,
    bookedSeats: 34,
    venue: 'fhfh',
    category: 'sport',
    isFree: true,
    price: 50,
    status: 'active',

    // Add other required properties based on your Event model
  };

  beforeEach(async () => {
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', [
      'close',
      'dismiss',
    ]);

    mockEventUtils = jasmine.createSpyObj('EventUtilsService', [
      'hasUserBookedEvent',
      'getAvailableSeats',
      'getBookingPercentage',
      'formatPrice',
      'isEventBookable',
      'getEventStatusBadgeClass',
      'getEventStatusText',
      'getBookingButtonText',
      'isBookingButtonDisabled',
      'getBookingButtonClass',
    ]);

    await TestBed.configureTestingModule({
      imports: [EventDetailsModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventDetailsModalComponent);
    component = fixture.componentInstance;

    component.event = mockEvent;
    component.userBookings = [];
    component.isBookingInProgress = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
