import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-event-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-modal.component.html',
  styleUrl: './event-modal.component.css',
})
export class EventModalComponent {
  @Input() event?: Event;
  @Input() isEditMode: boolean = false;
  @Input() categories: string[] = [
    'Conference',
    'Workshop',
    'Seminar',
    'Concert',
    'Exhibition',
    'Sports',
    'Other',
  ];

  @Output() eventSubmit = new EventEmitter<Event>();
  @Output() modalClose = new EventEmitter<void>();

  eventForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      time: [''],
      venue: ['', Validators.required],
      totalSeats: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      isFree: [true],
      price: [0, [Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (this.event && this.isEditMode) {
      this.eventForm.patchValue({
        name: this.event.name,
        description: this.event.description,
        date: this.event.date,
        time: this.event.time || '',
        venue: this.event.venue,
        totalSeats: this.event.totalSeats,
        category: this.event.category,
        isFree: this.event.isFree,
        price: this.event.price || 0,
      });
    }

    this.eventForm.get('isFree')?.valueChanges.subscribe((isFree) => {
      const priceControl = this.eventForm.get('price');
      if (isFree) {
        priceControl?.setValue(0);
        priceControl?.disable();
      } else {
        priceControl?.enable();
        if (priceControl?.value === 0) {
          priceControl?.setValue('');
        }
      }
    });
  }

  get f() {
    return this.eventForm.controls;
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.isLoading = true;
      const formData = this.eventForm.value;

      const eventData = {
        ...formData,
        price: formData.isFree ? 0 : formData.price,
      };

      if (this.isEditMode && this.event) {
        const updateData: Event = {
          id: this.event.id,
          ...eventData,
        };
        this.eventSubmit.emit(updateData);
      } else {
        const createData: Event = eventData;
        this.eventSubmit.emit(createData);
      }

      setTimeout(() => {
        this.isLoading = false;
        this.close();
      }, 1000);
    } else {
      this.eventForm.markAllAsTouched();
    }
  }

  close() {
    this.modalClose.emit();
    this.activeModal.close();
  }

  dismiss() {
    this.activeModal.dismiss();
  }
}
