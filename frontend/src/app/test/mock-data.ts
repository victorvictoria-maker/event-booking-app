import { User } from '../models/auth.model';
import {
  AdminDashboardData,
  BookingAnalyticsData,
  RevenueStatsData,
  TopUser,
  UserDashboardData,
} from '../models/dashboard.model';
import { Event, EventFilters } from '../models/event.model';

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
  time: '12:00',
  totalSeats: 100,
  category: 'Music',
  venue: 'Abuja',
  isFree: false,
  price: 50,
  availableSeats: 80,
  bookedSeats: 20,
  status: 'active',
};

export const mockEventFilters: EventFilters = {
  searchTerm: 'music',
  category: 'Music',
  status: 'active',
  priceFilter: 'paid',
};

export const mockBooking = {
  _id: 'gh56781',
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
    totalSeats: 100,
    bookedSeats: 20,
    availableSeats: 80,
  },
  totalAmount: 50,
  paymentStatus: 'paid',
  createdAt: '2025-07-01T00:00:00.000Z',
};

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
