export interface CategoryStats {
  count: number;
  bookedSeats: number;
  totalSeats: number;
  events: any[];
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedEventsResponse {
  status: string;
  data: {
    events: Event[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  message: string;
}
