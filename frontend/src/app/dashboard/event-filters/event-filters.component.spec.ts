import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { EventFiltersComponent } from './event-filters.component';
import { EventFilters } from '../../models/event.model';
import categories from '../../data/eventCategories';

describe('EventFiltersComponent', () => {
  let component: EventFiltersComponent;
  let fixture: ComponentFixture<EventFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFiltersComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(EventFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should have default filter values', () => {
      expect(component.filters).toEqual({
        searchTerm: '',
        category: '',
        status: '',
        priceFilter: '',
      });
    });

    it('should have default categories from imported data', () => {
      expect(component.categories).toEqual(categories);
    });

    it('should have default statuses', () => {
      expect(component.statuses).toEqual(['active', 'cancelled', 'completed']);
    });

    it('should have default showPriceFilter as true', () => {
      expect(component.showPriceFilter).toBe(true);
    });

    it('should have default showStatusFilter as true', () => {
      expect(component.showStatusFilter).toBe(true);
    });
  });

  describe('Custom filters input', () => {
    it('should accept custom filters input', () => {
      const customFilters: EventFilters = {
        searchTerm: 'Event 123',
        category: 'Technology',
        status: 'active',
        priceFilter: 'free',
      };

      component.filters = customFilters;
      fixture.detectChanges();

      expect(component.filters).toEqual(customFilters);
    });
  });

  describe('Clear Filters', () => {
    it('should clear all filters when onClearFilters is called', () => {
      component.filters = {
        searchTerm: 'Event 123',
        category: 'Technology',
        status: 'active',
        priceFilter: 'free',
      };

      component.onClearFilters();

      expect(component.filters).toEqual({
        searchTerm: '',
        category: '',
        status: '',
        priceFilter: '',
      });
    });

    it('should emit clearFilters when onClearFilters is called', () => {
      spyOn(component.clearFilters, 'emit');

      component.onClearFilters();

      expect(component.clearFilters.emit).toHaveBeenCalled();
    });

    it('should call onClearFilters when clear button is clicked', () => {
      spyOn(component, 'onClearFilters');

      const clearButton = fixture.debugElement.query(
        By.css('button:has(i.fa-times)')
      );
      clearButton.nativeElement.click();

      expect(component.onClearFilters).toHaveBeenCalled();
    });
  });

  describe('Methods for Filter Change', () => {
    it('should emit current filters in onSearchChange', () => {
      spyOn(component.filtersChange, 'emit');

      component.filters.searchTerm = 'test';
      component.onSearchChange();

      expect(component.filtersChange.emit).toHaveBeenCalledWith({
        searchTerm: 'test',
        category: '',
        status: '',
        priceFilter: '',
      });
    });

    it('should emit current filters in onCategoryChange', () => {
      spyOn(component.filtersChange, 'emit');

      component.filters.category = 'Technology';
      component.onCategoryChange();

      expect(component.filtersChange.emit).toHaveBeenCalledWith({
        searchTerm: '',
        category: 'Technology',
        status: '',
        priceFilter: '',
      });
    });

    it('should emit current filters in onStatusChange', () => {
      spyOn(component.filtersChange, 'emit');

      component.filters.status = 'active';
      component.onStatusChange();

      expect(component.filtersChange.emit).toHaveBeenCalledWith({
        searchTerm: '',
        category: '',
        status: 'active',
        priceFilter: '',
      });
    });

    it('should emit current filters in onPriceFilterChange', () => {
      spyOn(component.filtersChange, 'emit');

      component.filters.priceFilter = 'free';
      component.onPriceFilterChange();

      expect(component.filtersChange.emit).toHaveBeenCalledWith({
        searchTerm: '',
        category: '',
        status: '',
        priceFilter: 'free',
      });
    });
  });

  describe('The UI', () => {
    it('should display search input with correct placeholder', () => {
      const searchInput = fixture.debugElement.query(
        By.css('input[type="text"]')
      );
      expect(searchInput.nativeElement.placeholder).toBe(
        'Search by name, venue, category...'
      );
    });

    it('should display search button with search icon', () => {
      const searchButton = fixture.debugElement.query(
        By.css('button:has(i.fa-search)')
      );
      expect(searchButton).toBeTruthy();

      const searchIcon = searchButton.query(By.css('i.fa-search'));
      expect(searchIcon).toBeTruthy();
    });

    it('should display clear button with correct text and icon', () => {
      const clearButton = fixture.debugElement.query(
        By.css('button:has(i.fa-times)')
      );
      expect(clearButton).toBeTruthy();
      expect(clearButton.nativeElement.textContent.trim()).toContain('Clear');

      const clearIcon = clearButton.query(By.css('i.fa-times'));
      expect(clearIcon).toBeTruthy();
    });

    it('should display correct labels for form controls', () => {
      const labels = fixture.debugElement.queryAll(By.css('label'));
      const labelTexts = labels.map((label) =>
        label.nativeElement.textContent.trim()
      );

      expect(labelTexts).toContain('Search Events');
      expect(labelTexts).toContain('Category');
      expect(labelTexts).toContain('Status');
      expect(labelTexts).toContain('Price');
    });
  });
});
