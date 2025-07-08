export interface DashboardOverview {
  totalEvents: number;
  totalBookings: number;
  totalRevenue: number;
  mostPopularEvents: PopularEvent[];
}

export interface PopularEvent {
  _id: string;
  bookingCount: number;
  revenue: number;
  eventDetails: {
    _id: string;
    name: string;
    date: Date;
    venue: string;
    category: string;
  };
}

export interface RecentBooking {
  _id: string;
  totalAmount: number;
  createdAt: Date;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  event: {
    _id: string;
    name: string;
    date: Date;
    venue: string;
  };
}

export interface EventStatusDistribution {
  _id: string;
  count: number;
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  revenue: number;
  bookings: number;
}

export interface AdminDashboardData {
  overview: DashboardOverview;
  recentBookings: RecentBooking[];
  eventStatusDistribution: EventStatusDistribution[];
  monthlyRevenue: MonthlyRevenue[];
}

export interface UserDashboardOverview {
  totalBookings: number;
  totalAmountSpent: number;
  upcomingEvents: number;
}

export interface BookingTrend {
  _id: {
    year: number;
    month: number;
  };
  count: number;
  amount: number;
}

export interface FavoriteCategory {
  _id: string;
  count: number;
}

export interface UserDashboardData {
  overview: UserDashboardOverview;
  recentBookings: RecentBooking[];
  upcomingEvents: any[];
  bookingTrends: BookingTrend[];
  favoriteCategories: FavoriteCategory[];
}

export interface RevenueStatsParams {
  startDate?: string;
  endDate?: string;
}

export interface DailyRevenueStat {
  date: Date;
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
}

export interface RevenueStatsData {
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  revenueStats: DailyRevenueStat[];
}

export interface BookingAnalyticsParams {
  period?: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
}

export interface BookingAnalyticsData {
  period: string;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  bookingTrends: BookingTrend[];
  bookingsByDayOfWeek: {
    _id: number;
    count: number;
    revenue: number;
  }[];
}

export interface TopUser {
  _id: string;
  bookingCount: number;
  totalSpent: number;
  userDetails: {
    _id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}
