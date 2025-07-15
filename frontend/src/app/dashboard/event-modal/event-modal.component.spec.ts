import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { By } from '@angular/platform-browser';
import { EventModalComponent } from './event-modal.component';
import categories from '../../data/eventCategories';
import { mockEvent } from '../../test/mock-data';

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
      imports: [EventModalComponent, ReactiveFormsModule],
      providers: [{ provide: NgbActiveModal, useValue: mockActiveModal }],
    }).compileComponents();

    fixture = TestBed.createComponent(EventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values and validators', () => {
    expect(component.eventForm.get('name')?.value).toBe('');
    expect(component.eventForm.get('description')?.value).toBe('');
    expect(component.eventForm.get('date')?.value).toBe('');
    expect(component.eventForm.get('time')?.value).toBe('');
    expect(component.eventForm.get('venue')?.value).toBe('');
    expect(component.eventForm.get('totalSeats')?.value).toBe('');
    expect(component.eventForm.get('category')?.value).toBe('');
    expect(component.eventForm.get('isFree')?.value).toBe(true);
    expect(component.eventForm.get('price')?.value).toBe(0);

    expect(component.eventForm.get('name')?.hasError('required')).toBe(true);
    expect(component.eventForm.get('description')?.hasError('required')).toBe(
      true
    );
    expect(component.eventForm.get('date')?.hasError('required')).toBe(true);
    expect(component.eventForm.get('time')?.hasError('required')).toBe(true);
    expect(component.eventForm.get('venue')?.hasError('required')).toBe(true);
    expect(component.eventForm.get('totalSeats')?.hasError('required')).toBe(
      true
    );
    expect(component.eventForm.get('category')?.hasError('required')).toBe(
      true
    );
  });

  it('should have default input properties', () => {
    expect(component.event).toBeUndefined();
    expect(component.isEditMode).toBe(false);
    expect(component.categories).toEqual(categories);
  });

  it('should set minimum date to tomorrow', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedMinDate = tomorrow.toISOString().split('T')[0];

    expect(component.minDate).toBe(expectedMinDate);
  });

  describe('ngOnInit', () => {
    it('should populate form with event data in edit mode', () => {
      component.event = mockEvent;
      component.isEditMode = true;
      component.categories = ['Technology', 'Business', 'Arts', 'Music'];

      component.ngOnInit();

      expect(component.eventForm.get('name')?.value).toBe('Farming Festival');
      expect(component.eventForm.get('description')?.value).toBe(
        'Test Description'
      );
      expect(component.eventForm.get('date')?.value).toBe('2025-07-01');
      expect(component.eventForm.get('time')?.value).toBe('10:00 - 12:00');
      expect(component.eventForm.get('venue')?.value).toBe('Abuja');
      expect(component.eventForm.get('totalSeats')?.value).toBe(100);
      expect(component.eventForm.get('category')?.value).toBe('Music');
      expect(component.eventForm.get('isFree')?.value).toBe(false);
      expect(component.eventForm.get('price')?.value).toBe(50);
    });

    it('should disable price field when isFree is true', () => {
      component.ngOnInit();
      component.eventForm.get('isFree')?.setValue(true);

      expect(component.eventForm.get('price')?.disabled).toBe(true);
    });

    it('should enable price field and clear value when isFree changes to false', () => {
      component.ngOnInit();
      component.eventForm.get('isFree')?.setValue(false);

      expect(component.eventForm.get('price')?.enabled).toBe(true);
      expect(component.eventForm.get('price')?.value).toBe('');
    });

    it('should set price to 0 when isFree changes to true', () => {
      component.ngOnInit();

      component.eventForm.get('isFree')?.setValue(false);
      component.eventForm.get('price')?.setValue(25);
      component.eventForm.get('isFree')?.setValue(true);

      expect(component.eventForm.get('price')?.value).toBe(0);
      expect(component.eventForm.get('price')?.disabled).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should show required error for empty name', () => {
      const nameControl = component.eventForm.get('name');
      nameControl?.setValue('');
      nameControl?.markAsTouched();

      expect(nameControl?.hasError('required')).toBe(true);
    });

    it('should show minlength error for name less than 3 characters', () => {
      const nameControl = component.eventForm.get('name');
      nameControl?.setValue('AB');
      nameControl?.markAsTouched();

      expect(nameControl?.hasError('minlength')).toBe(true);
    });

    it('should show required error for empty description', () => {
      const descControl = component.eventForm.get('description');
      descControl?.setValue('');
      descControl?.markAsTouched();

      expect(descControl?.hasError('required')).toBe(true);
    });

    it('should show minlength error for description less than 10 characters', () => {
      const descControl = component.eventForm.get('description');
      descControl?.setValue('Short');
      descControl?.markAsTouched();

      expect(descControl?.hasError('minlength')).toBe(true);
    });

    it('should show required error for empty date', () => {
      const dateControl = component.eventForm.get('date');
      dateControl?.setValue('');
      dateControl?.markAsTouched();

      expect(dateControl?.hasError('required')).toBe(true);
    });

    it('should show required error for empty time', () => {
      const timeControl = component.eventForm.get('time');
      timeControl?.setValue('');
      timeControl?.markAsTouched();

      expect(timeControl?.hasError('required')).toBe(true);
    });

    it('should show required error for empty venue', () => {
      const venueControl = component.eventForm.get('venue');
      venueControl?.setValue('');
      venueControl?.markAsTouched();

      expect(venueControl?.hasError('required')).toBe(true);
    });

    it('should show required error for empty totalSeats', () => {
      const seatsControl = component.eventForm.get('totalSeats');
      seatsControl?.setValue('');
      seatsControl?.markAsTouched();

      expect(seatsControl?.hasError('required')).toBe(true);
    });

    it('should show min error for totalSeats less than 1', () => {
      const seatsControl = component.eventForm.get('totalSeats');
      seatsControl?.setValue(0);
      seatsControl?.markAsTouched();

      expect(seatsControl?.hasError('min')).toBe(true);
    });

    it('should show required error for empty category', () => {
      const categoryControl = component.eventForm.get('category');
      categoryControl?.setValue('');
      categoryControl?.markAsTouched();

      expect(categoryControl?.hasError('required')).toBe(true);
    });

    it('should show min error for negative price', () => {
      const priceControl = component.eventForm.get('price');
      component.eventForm.get('isFree')?.setValue(false);
      priceControl?.setValue(-1);
      priceControl?.markAsTouched();

      expect(priceControl?.hasError('min')).toBe(true);
    });

    it('should be valid when all fields are properly filled', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      component.eventForm.patchValue({
        name: 'Farming Festival',
        description: 'Test Description',
        date: tomorrowStr,
        time: '10:00 - 12:00',
        venue: 'Abuja',
        totalSeats: 100,
        category: 'Technology',
        isFree: true,
        price: 0,
      });

      expect(component.eventForm.valid).toBe(true);
    });
  });

  describe('Form Controls Getter', () => {
    it('should return form controls through f getter', () => {
      const controls = component.f;
      expect(controls).toBe(component.eventForm.controls);
      expect(controls['name']).toBeDefined();
      expect(controls['description']).toBeDefined();
      expect(controls['date']).toBeDefined();
      expect(controls['time']).toBeDefined();
      expect(controls['venue']).toBeDefined();
      expect(controls['totalSeats']).toBeDefined();
      expect(controls['category']).toBeDefined();
      expect(controls['isFree']).toBeDefined();
      expect(controls['price']).toBeDefined();
    });
  });

  describe('onSubmit', () => {
    it('should not submit when form is invalid', () => {
      spyOn(component.eventSubmit, 'emit');

      component.eventForm.patchValue({
        name: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        totalSeats: '',
        category: '',
      });

      component.onSubmit();

      expect(component.eventSubmit.emit).not.toHaveBeenCalled();
      expect(component.eventForm.get('name')?.touched).toBe(true);
      expect(component.eventForm.get('description')?.touched).toBe(true);
      expect(component.eventForm.get('date')?.touched).toBe(true);
      expect(component.eventForm.get('time')?.touched).toBe(true);
      expect(component.eventForm.get('venue')?.touched).toBe(true);
      expect(component.eventForm.get('totalSeats')?.touched).toBe(true);
      expect(component.eventForm.get('category')?.touched).toBe(true);
    });

    it('should emit event data for new event creation', fakeAsync(() => {
      spyOn(component.eventSubmit, 'emit');
      spyOn(component, 'close');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      component.eventForm.patchValue({
        name: 'Farming Festival',
        description: 'Test Description',
        date: tomorrowStr,
        time: '10:00 - 12:00',
        venue: 'Abuja',
        totalSeats: 100,
        category: 'Technology',
        isFree: true,
        price: 0,
      });

      component.onSubmit();

      expect(component.isLoading).toBe(true);
      expect(component.eventSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Farming Festival',
          description: 'Test Description',
          date: tomorrowStr,
          time: '10:00 - 12:00',
          venue: 'Abuja',
          totalSeats: 100,
          category: 'Technology',
          isFree: true,
          price: 0,
        })
      );

      tick(1000);

      expect(component.isLoading).toBe(false);
      expect(component.close).toHaveBeenCalled();
    }));

    it('should emit event data with id for event update', fakeAsync(() => {
      spyOn(component.eventSubmit, 'emit');
      spyOn(component, 'close');

      component.event = mockEvent;
      component.isEditMode = true;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      component.eventForm.patchValue({
        name: 'Updated Event',
        description: 'Updated description for the event',
        date: tomorrowStr,
        time: '10:00 - 12:00',
        venue: 'Updated Venue',
        totalSeats: 100,
        category: 'Technology',
        isFree: false,
        price: 50,
      });

      component.onSubmit();

      expect(component.eventSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          id: '1',
          name: 'Updated Event',
          description: 'Updated description for the event',
          date: tomorrowStr,
          time: '10:00 - 12:00',
          venue: 'Updated Venue',
          totalSeats: 100,
          category: 'Technology',
          isFree: false,
          price: 50,
        })
      );

      tick(1000);

      expect(component.close).toHaveBeenCalled();
    }));

    it('should set price to 0 for free events', fakeAsync(() => {
      spyOn(component.eventSubmit, 'emit');
      spyOn(component, 'close');

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      component.eventForm.patchValue({
        name: 'Free Event',
        description: 'Test Description',
        date: tomorrowStr,
        time: '10:00 - 12:00',
        venue: 'Free Venue',
        totalSeats: 100,
        category: 'Community',
        isFree: true,
        price: 25,
      });

      component.onSubmit();

      expect(component.eventSubmit.emit).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: 'Free Event',
          description: 'Test Description',
          date: tomorrowStr,
          time: '10:00 - 12:00',
          venue: 'Free Venue',
          totalSeats: 100,
          category: 'Community',
          isFree: true,
          price: 0,
        })
      );

      tick(1000);
    }));

    it('should call onSubmit method when form is submitted', () => {
      spyOn(component, 'onSubmit');

      const form = fixture.debugElement.query(By.css('form'));
      if (form) {
        form.nativeElement.dispatchEvent(new Event('submit'));
        expect(component.onSubmit).toHaveBeenCalled();
      }
    });
  });

  describe('Modal Actions', () => {
    it('should close modal and emit modalClose event', () => {
      spyOn(component.modalClose, 'emit');

      component.close();

      expect(component.modalClose.emit).toHaveBeenCalled();
      expect(mockActiveModal.close).toHaveBeenCalled();
    });

    it('should dismiss modal', () => {
      component.dismiss();

      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });

    it('should call dismiss when close button is clicked', () => {
      spyOn(component, 'dismiss');

      const closeButton = fixture.debugElement.query(By.css('.btn-close'));
      if (closeButton) {
        closeButton.nativeElement.click();
        expect(component.dismiss).toHaveBeenCalled();
      }
    });

    it('should call dismiss when cancel button is clicked', () => {
      spyOn(component, 'dismiss');

      const cancelButton = fixture.debugElement.query(
        By.css('.btn-outline-secondary')
      );
      if (cancelButton) {
        cancelButton.nativeElement.click();
        expect(component.dismiss).toHaveBeenCalled();
      }
    });
  });

  describe('Component Properties', () => {
    it('should have event input property', () => {
      const testEvent = mockEvent;

      component.event = testEvent;
      expect(component.event).toEqual(testEvent);
    });

    it('should have isEditMode input property with default value false', () => {
      expect(component.isEditMode).toBe(false);
    });

    it('should have categories input property with default categories', () => {
      expect(component.categories).toEqual(categories);
    });

    it('should accept custom categories input', () => {
      const customCategories = ['Custom1', 'Custom2', 'Custom3'];
      component.categories = customCategories;
      expect(component.categories).toEqual(customCategories);
    });
  });

  describe('The UI', () => {
    it('should display "Create New Event" title in create mode', () => {
      component.isEditMode = false;
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('.modal-title'));
      expect(title?.nativeElement.textContent.trim()).toBe('Create New Event');
    });

    it('should display "Edit Event" title in edit mode', () => {
      component.isEditMode = true;
      fixture.detectChanges();

      const title = fixture.debugElement.query(By.css('.modal-title'));
      expect(title?.nativeElement.textContent.trim()).toBe('Edit Event');
    });

    it('should display "Create Event" button text in create mode', () => {
      component.isEditMode = false;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton?.nativeElement.textContent.trim()).toContain(
        'Create Event'
      );
    });

    it('should display "Update Event" button text in edit mode', () => {
      component.isEditMode = true;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton?.nativeElement.textContent.trim()).toContain(
        'Update Event'
      );
    });

    it('should disable submit button when form is invalid', () => {
      component.eventForm.patchValue({
        name: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        totalSeats: '',
        category: '',
      });

      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton?.nativeElement.disabled).toBe(true);
    });

    it('should disable submit button when isLoading is true', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      component.eventForm.patchValue({
        name: 'Farming Festival',
        description: 'Test Description',
        date: tomorrowStr,
        time: '10:00 - 12:00',
        venue: 'Abuja',
        totalSeats: 100,
        category: 'Technology',
        isFree: true,
        price: 0,
      });

      component.isLoading = true;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton?.nativeElement.disabled).toBe(true);
    });

    it('should show loading text when isLoading is true', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const submitButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      expect(submitButton?.nativeElement.textContent.trim()).toContain(
        'Saving...'
      );
    });

    it('should hide price field when isFree is true', () => {
      component.eventForm.get('isFree')?.setValue(true);
      fixture.detectChanges();

      const priceFieldContainer = fixture.debugElement.query(
        By.css('div:has(input[formControlName="price"])')
      );

      expect(priceFieldContainer).toBeNull();
    });

    it('should show price field when isFree is false', () => {
      component.eventForm.get('isFree')?.setValue(false);
      fixture.detectChanges();

      const priceField = fixture.debugElement.query(
        By.css('input[formControlName="price"]')
      );
      expect(priceField?.parent?.nativeElement.style.display).not.toBe('none');
    });
  });
});
