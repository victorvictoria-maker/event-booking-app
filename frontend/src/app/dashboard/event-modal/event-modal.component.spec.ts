import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventModalComponent } from './event-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('EventModalComponent', () => {
  let component: EventModalComponent;
  let fixture: ComponentFixture<EventModalComponent>;
  let mockActiveModal: jasmine.SpyObj<NgbActiveModal>;

  beforeEach(async () => {
    mockActiveModal = jasmine.createSpyObj('NgbActiveModal', [
      'close',
      'dismiss',
    ]);

    await TestBed.configureTestingModule({
      imports: [EventModalComponent],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
