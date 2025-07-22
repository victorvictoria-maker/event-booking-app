export interface Event {
  _id: string;
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  // location?: string;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  category: string;
  status: 'active' | 'cancelled' | 'completed';
  price: number;
  isFree: boolean;
  imageUrl?: string;
  organizer?: {
    _id: string;
    email: string;
    username: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface EventFilters {
  searchTerm: string;
  category: string;
  status: string;
  priceFilter?: 'free' | 'paid' | '';
}

export interface EventStats {
  totalEvents: number;
  activeEvents: number;
  totalBookings: number;
  availableSeats: number;
}

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
