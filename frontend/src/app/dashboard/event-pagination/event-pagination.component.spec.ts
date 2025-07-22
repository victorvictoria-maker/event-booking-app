import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EventPaginationComponent } from './event-pagination.component';
import { mockPaginationData } from '../../test/mock-data';

describe('EventPaginationComponent', () => {
  let component: EventPaginationComponent;
  let fixture: ComponentFixture<EventPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventPaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EventPaginationComponent);
    component = fixture.componentInstance;
    component.paginationData = { ...mockPaginationData };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFromCount', () => {
    it('should return correct from count', () => {
      expect(component.getFromCount()).toBe(21);
    });
  });

  describe('getToCount', () => {
    it('should return correct to count', () => {
      expect(component.getToCount()).toBe(30);
    });

    it('should return totalItems if currentPage * itemsPerPage exceeds totalItems', () => {
      component.paginationData = {
        ...mockPaginationData,
        currentPage: 10,
        totalItems: 95,
      };
      expect(component.getToCount()).toBe(95);
    });
  });

  describe('getPageNumbers', () => {
    it('should return correct page range centered around current page', () => {
      const pages = component.getPageNumbers();
      expect(pages).toEqual([1, 2, 3, 4, 5]);
    });

    it('should adjust when near end', () => {
      component.paginationData = { ...mockPaginationData, currentPage: 9 };
      const pages = component.getPageNumbers();
      expect(pages).toEqual([6, 7, 8, 9, 10]);
    });

    it('should adjust when totalPages < maxVisiblePages', () => {
      component.paginationData = {
        ...mockPaginationData,
        currentPage: 1,
        totalPages: 3,
      };
      const pages = component.getPageNumbers();
      expect(pages).toEqual([1, 2, 3]);
    });
  });

  describe('trackByPageNumber', () => {
    it('should return the page number itself', () => {
      expect(component.trackByPageNumber(0, 3)).toBe(3);
    });
  });

  describe('onPageChange', () => {
    it('should emit valid new page', () => {
      spyOn(component.pageChange, 'emit');
      component.onPageChange(4);
      expect(component.pageChange.emit).toHaveBeenCalledWith(4);
    });
  });

  describe('onPreviousPage', () => {
    it('should emit previousPage if allowed', () => {
      spyOn(component.previousPage, 'emit');
      component.onPreviousPage();
      expect(component.previousPage.emit).toHaveBeenCalled();
    });

    it('should not emit if hasPrevPage is false', () => {
      component.paginationData.hasPrevPage = false;
      spyOn(component.previousPage, 'emit');
      component.onPreviousPage();
      expect(component.previousPage.emit).not.toHaveBeenCalled();
    });
  });

  describe('onNextPage', () => {
    it('should emit nextPage if hasNextPage is true', () => {
      spyOn(component.nextPage, 'emit');
      component.onNextPage();
      expect(component.nextPage.emit).toHaveBeenCalled();
    });

    it('should not emit if hasNextPage is false', () => {
      component.paginationData.hasNextPage = false;
      spyOn(component.nextPage, 'emit');
      component.onNextPage();
      expect(component.nextPage.emit).not.toHaveBeenCalled();
    });
  });

  describe('UI Rendering', () => {
    it('should show correct range text', () => {
      const from = component.getFromCount();
      const to = component.getToCount();
      const text = fixture.nativeElement.textContent;
      expect(text).toContain(`${from}`);
      expect(text).toContain(`${to}`);
    });

    it('should call onPageChange when a page button is clicked', () => {
      spyOn(component, 'onPageChange');
      const pageButtons = fixture.debugElement.queryAll(By.css('.page-item'));
      const btn = pageButtons
        .find((b) => b.nativeElement.textContent.includes('2'))
        ?.query(By.css('button'));
      btn?.nativeElement.click();
      expect(component.onPageChange).toHaveBeenCalled();
    });

    it('should call onPreviousPage when prev button is clicked', () => {
      spyOn(component, 'onPreviousPage');
      const prevBtn = fixture.debugElement.query(
        By.css('.page-item:first-child button')
      );
      prevBtn.nativeElement.click();
      expect(component.onPreviousPage).toHaveBeenCalled();
    });

    it('should call onNextPage when next button is clicked', () => {
      spyOn(component, 'onNextPage');
      const items = fixture.debugElement.queryAll(By.css('.page-item'));
      const nextBtn = items[items.length - 1].query(By.css('button'));
      nextBtn.nativeElement.click();
      expect(component.onNextPage).toHaveBeenCalled();
    });
  });
});
