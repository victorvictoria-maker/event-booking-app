import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventFilters } from '../../models/event.model';

@Component({
  selector: 'app-event-filters',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-filters.component.html',
  styleUrl: './event-filters.component.css',
})
export class EventFiltersComponent {
  @Input() filters: EventFilters = {
    searchTerm: '',
    category: '',
    status: '',
    priceFilter: '',
  };

  @Input() categories: string[] = [
    'Conference',
    'Workshop',
    'Seminar',
    'Concert',
    'Exhibition',
    'Sports',
    'Other',
  ];

  @Input() statuses: string[] = ['active', 'cancelled', 'completed'];
  @Input() showPriceFilter: boolean = true;
  @Input() showStatusFilter: boolean = true;

  @Output() filtersChange = new EventEmitter<EventFilters>();
  @Output() clearFilters = new EventEmitter<void>();

  onSearchChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  onCategoryChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  onStatusChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  onPriceFilterChange() {
    this.filtersChange.emit({ ...this.filters });
  }

  onClearFilters() {
    this.filters = {
      searchTerm: '',
      category: '',
      status: '',
      priceFilter: '',
    };
    this.clearFilters.emit();
  }
}
