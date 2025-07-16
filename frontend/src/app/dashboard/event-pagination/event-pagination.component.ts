import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginationData } from '../../models/event.model';

@Component({
  selector: 'app-event-pagination',
  imports: [CommonModule],
  templateUrl: './event-pagination.component.html',
  styleUrl: './event-pagination.component.css',
})
export class EventPaginationComponent {
  @Input() paginationData: PaginationData = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  };

  @Input() ariaLabel: string = 'Events pagination';

  @Output() pageChange = new EventEmitter<number>();
  @Output() previousPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  getFromCount(): number {
    return (
      (this.paginationData.currentPage - 1) * this.paginationData.itemsPerPage +
      1
    );
  }

  getToCount(): number {
    return Math.min(
      this.paginationData.currentPage * this.paginationData.itemsPerPage,
      this.paginationData.totalItems
    );
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, this.paginationData.currentPage - halfVisible);
    let endPage = Math.min(
      this.paginationData.totalPages,
      startPage + maxVisiblePages - 1
    );

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  trackByPageNumber(index: number, page: number): number {
    return page;
  }

  onPageChange(page: number): void {
    if (
      page >= 1 &&
      page <= this.paginationData.totalPages &&
      page !== this.paginationData.currentPage
    ) {
      this.pageChange.emit(page);
    }
  }

  onPreviousPage(): void {
    if (this.paginationData.hasPrevPage) {
      this.previousPage.emit();
    }
  }

  onNextPage(): void {
    if (this.paginationData.hasNextPage) {
      this.nextPage.emit();
    }
  }
}
