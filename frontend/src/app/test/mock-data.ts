import { User } from '../models/auth.model';
import {
  AdminDashboardData,
  BookingAnalyticsData,
  RevenueStatsData,
  TopUser,
  UserDashboardData,
} from '../models/dashboard.model';
import { Event, EventFilters, PaginationData } from '../models/event.model';

export const mockUser: User = {
  username: 'vicky',
  email: 'vee@gmail.com',
  password: 'password123',
  confirmPassword: 'password123',
  isAdmin: false,
};

export const mockEvent: Event = {
  id: '1',
  _id: '1',
  name: 'Farming Festival',
  description: 'Test Description',
  date: '2025-07-01',
  time: '10:00 - 12:00',
  totalSeats: 100,
  category: 'Music',
  venue: 'Abuja',
  isFree: false,
  price: 50,
  availableSeats: 80,
  bookedSeats: 20,
  status: 'active',
};

export const mockEvent2: Event = {
  id: '2',
  _id: '2',
  name: 'Tech Conference',
  description: 'Technology conference description',
  date: '2025-08-15',
  time: '09:00 - 17:00',
  totalSeats: 200,
  category: 'Technology',
  venue: 'Lagos',
  isFree: true,
  price: 0,
  availableSeats: 150,
  bookedSeats: 50,
  status: 'active',
};

export const mockEvent3: Event = {
  id: '3',
  _id: '3',
  name: 'Art Exhibition',
  description: 'Beautiful art exhibition',
  date: '2025-09-10',
  time: '11:00 - 18:00',
  totalSeats: 75,
  category: 'Art',
  venue: 'Port Harcourt',
  isFree: false,
  price: 25,
  availableSeats: 0,
  bookedSeats: 75,
  status: 'active',
};

export const mockEvents: Event[] = [mockEvent, mockEvent2, mockEvent3];

export const mockEventFilters: EventFilters = {
  searchTerm: 'music',
  category: 'Music',
  status: 'active',
  priceFilter: 'paid',
};

export const mockBooking = {
  _id: 'booking1',
  eventId: '1',
  user: {
    _id: '23456fghnm',
    username: 'vicky',
    email: 'vee@gmail.com',
  },
  event: {
    _id: '1',
    name: 'Farming Festival',
    date: '2025-07-01',
    venue: 'Abuja',
    price: 50,
    isFree: false,
    category: 'networking',
    totalSeats: 100,
    bookedSeats: 20,
    availableSeats: 80,
  },
  totalAmount: 50,
  paymentStatus: 'paid',
  createdAt: '2025-07-01T00:00:00.000Z',
  updatedAt: '2025-07-01T00:00:00.000Z',
};

export const mockBooking2 = {
  _id: 'booking2',
  eventId: '2',
  user: {
    _id: '23456fghnm',
    username: 'vicky',
    email: 'vee@gmail.com',
  },
  event: {
    _id: '2',
    name: 'Tech Conference',
    date: '2025-08-15',
    venue: 'Lagos',
    price: 0,
    isFree: true,
    category: 'technology',
    totalSeats: 200,
    bookedSeats: 50,
    availableSeats: 150,
  },
  totalAmount: 0,
  paymentStatus: 'paid',
  createdAt: '2025-07-02T00:00:00.000Z',
  updatedAt: '2025-07-02T00:00:00.000Z',
};

export const mockBooking3 = {
  _id: 'booking3',
  eventId: '4',
  user: {
    _id: '23456fghnm',
    username: 'vicky',
    email: 'vee@gmail.com',
  },
  event: {
    _id: '4',
    name: 'Music Concert',
    date: '2025-09-01',
    venue: 'Kano',
    price: 75,
    isFree: false,
    category: 'music',
    totalSeats: 150,
    bookedSeats: 30,
    availableSeats: 120,
  },
  totalAmount: 75,
  paymentStatus: 'paid',
  createdAt: '2025-07-03T00:00:00.000Z',
  updatedAt: '2025-07-03T00:00:00.000Z',
};

export const mockBookings = [mockBooking, mockBooking2, mockBooking3];

export const mockBookingStats = {
  totalBookings: 5,
  totalAmount: 250,
};

export const mockUserDashboardData: UserDashboardData = {
  overview: {
    totalBookings: 5,
    totalAmountSpent: 250,
    upcomingEvents: 1,
  },
  recentBookings: [
    {
      _id: '1',
      totalAmount: 50,
      createdAt: new Date('2025-07-01T00:00:00.000Z'),
      user: {
        _id: '23456fghnm',
        username: 'vicky',
        email: 'vee@gmail.com',
      },
      event: {
        _id: 'gh56781',
        name: 'Farming Festival',
        date: new Date('2025-07-01T00:00:00.000Z'),
        venue: 'Abuja',
      },
    },
  ],
  upcomingEvents: [
    {
      _id: '1',
      totalAmount: 75,
      createdAt: new Date('2025-08-01T00:00:00.000Z'),
      user: {
        _id: 'user1',
        username: 'vicky4',
        email: 'vee@gmail.com',
      },
      event: {
        _id: 'event2',
        name: 'Upcoming Event',
        date: new Date('2025-08-01T00:00:00.000Z'),
        venue: 'Future Venue',
        category: 'Technology',
      },
    },
  ],
  bookingTrends: [
    {
      _id: { year: 2025, month: 1 },
      count: 3,
      amount: 150,
    },
  ],
  favoriteCategories: [
    { _id: 'Music', count: 3 },
    { _id: 'Technology', count: 2 },
  ],
};

export const mockAdminDashboardData: AdminDashboardData = {
  overview: {
    totalEvents: 10,
    totalBookings: 25,
    totalRevenue: 1250,
    mostPopularEvents: [
      {
        _id: 'event1',
        bookingCount: 5,
        revenue: 250,
        eventDetails: {
          _id: 'event1',
          name: 'Popular Event',
          date: new Date('2025-07-01T00:00:00.000Z'),
          venue: 'Main Venue',
          category: 'Entertainment',
        },
      },
    ],
  },
  recentBookings: [
    {
      _id: '1',
      totalAmount: 100,
      createdAt: new Date('2025-07-01T00:00:00.000Z'),
      user: {
        _id: 'user1',
        username: 'vicky7',
        email: 'vee@gmail.com',
      },
      event: {
        _id: 'event1',
        name: 'Farming Festival',
        date: new Date('2025-07-01T00:00:00.000Z'),
        venue: 'Abuja',
      },
    },
  ],
  eventStatusDistribution: [
    { _id: 'active', count: 8 },
    { _id: 'inactive', count: 2 },
  ],
  monthlyRevenue: [
    {
      year: 2025,
      month: 1,
      revenue: 500,
      bookings: 10,
    },
  ],
};

export const mockRevenueStatsData: RevenueStatsData = {
  dateRange: {
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-01-31'),
  },
  revenueStats: [
    {
      date: new Date('2025-07-01'),
      totalRevenue: 100,
      totalBookings: 2,
      averageBookingValue: 50,
    },
    {
      date: new Date('2025-07-02'),
      totalRevenue: 150,
      totalBookings: 3,
      averageBookingValue: 50,
    },
  ],
};

export const mockBookingAnalyticsData: BookingAnalyticsData = {
  period: 'monthly',
  dateRange: {
    startDate: new Date('2025-07-01'),
    endDate: new Date('2025-01-31'),
  },
  bookingTrends: [
    {
      _id: { year: 2025, month: 1 },
      count: 5,
      amount: 250,
    },
  ],
  bookingsByDayOfWeek: [
    { _id: 1, count: 3, revenue: 150 }, // Sunday
    { _id: 2, count: 2, revenue: 100 }, // Monday
  ],
};

export const mockTopUsers: TopUser[] = [
  {
    _id: 'vee45',
    bookingCount: 5,
    totalSpent: 250,
    userDetails: {
      _id: 'user1',
      username: 'vee2',
      email: 'vee2@gmail.com',
    },
  },
  {
    _id: 'vee32',
    bookingCount: 3,
    totalSpent: 150,
    userDetails: {
      _id: 'user2',
      username: 'vee3',
      email: 'vee3@gmail.com',
    },
  },
];

export const mockPaginationData: PaginationData = {
  currentPage: 3,
  totalPages: 10,
  totalItems: 100,
  itemsPerPage: 10,
  hasNextPage: true,
  hasPrevPage: true,
};

export const mockEventsResponse = {
  data: {
    events: mockEvents,
    pagination: mockPaginationData,
  },
};

export const mockBookingsResponse = {
  data: {
    bookings: mockBookings,
  },
};

export const mockEmptyEventsResponse = {
  data: {
    events: [],
    pagination: null,
  },
};

export const mockEmptyBookingsResponse = {
  data: {
    bookings: [],
  },
};

export const mockCreateBookingResponse = {
  success: true,
  message: 'Booking created successfully',
  data: {
    booking: mockBooking,
  },
};

export const mockCancelBookingResponse = {
  success: true,
  message: 'Booking cancelled successfully',
};

export const mockEventStats = {
  data: {
    totalEvents: 10,
    activeEvents: 8,
    totalBookings: 25,
    totalAvailableSeats: 150,
  },
};

export const mockCreateEventResponse = {
  success: true,
  message: 'Event created successfully',
  data: { event: mockEvent },
};

export const mockUpdateEventResponse = {
  success: true,
  message: 'Event updated successfully',
  data: { event: mockEvent },
};

export const mockDeleteEventResponse = {
  success: true,
  message: 'Event deleted successfully',
};

export const mockToggleStatusResponse = {
  success: true,
  message: 'Event status updated successfully',
  data: { event: { ...mockEvent, status: 'cancelled' } },
};

export const mockAdminBookingFilters = {
  searchTerm: 'music',
  category: 'Music',
  eventStatus: 'active',
};

export const mockAdminBookingStats = {
  totalBookings: 3,
  paidBookings: 3,
  totalRevenue: 175,
};

export const mockBookingsPaginationResponse = {
  data: {
    bookings: mockBookings,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 3,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
};

export const mockEmptyBookingsPaginationResponse = {
  data: {
    bookings: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: 10,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
};

export const mockLargeBookingsResponse = {
  data: {
    bookings: [
      ...mockBookings,
      {
        _id: 'booking4',
        eventId: '3',
        user: {
          _id: '23456fghnm',
          username: 'alice',
          email: 'alice@gmail.com',
        },
        event: {
          _id: '3',
          name: 'Art Exhibition',
          date: '2025-09-10',
          time: '11:00 - 18:00',
          venue: 'Port Harcourt',
          price: 25,
          isFree: false,
          totalSeats: 75,
          bookedSeats: 75,
          availableSeats: 0,
          category: 'Art',
          status: 'active',
        },
        totalAmount: 25,
        paymentStatus: 'paid',
        createdAt: '2025-07-04T00:00:00.000Z',
      },
      {
        _id: 'booking5',
        eventId: '1',
        user: {
          _id: '789xyz',
          username: 'bob',
          email: 'bob@gmail.com',
        },
        event: {
          _id: '1',
          name: 'Farming Festival',
          date: '2025-07-01',
          time: '10:00 - 12:00',
          venue: 'Abuja',
          price: 50,
          isFree: false,
          totalSeats: 100,
          bookedSeats: 20,
          availableSeats: 80,
          category: 'Music',
          status: 'cancelled',
        },
        totalAmount: 50,
        paymentStatus: 'pending',
        createdAt: '2025-07-05T00:00:00.000Z',
        updatedAt: '2025-07-05T00:00:00.000Z',
      },
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 5,
      itemsPerPage: 1000,
      hasNextPage: false,
      hasPrevPage: false,
    },
  },
};
