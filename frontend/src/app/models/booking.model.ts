export interface Booking {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  event: {
    _id: string;
    name: string;
    description?: string;
    date: Date;
    venue: string;
    price: number;
    time: string;
    isFree: boolean;
    category: string;
    totalSeats: number;
    bookedSeats: number;
    organizer: string;
    status: string;
  };
  bookingDate: Date;
  totalAmount: number;
  paymentStatus: 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingStats {
  totalBookings: number;
  totalAmount: number;
}

export interface BookingPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface BookingResponse {
  bookings: Booking[];
  pagination: BookingPagination;
}
