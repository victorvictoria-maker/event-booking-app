import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Chart, ChartConfiguration, ChartData, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ToastrService } from 'ngx-toastr';
import { FormatNumber } from '../../utils/formatNumber';
import { Pluralize } from '../../utils/pluralize';
import { AdminDashboardService } from '../../services/dashboard.service';
import {
  AdminDashboardData,
  BookingAnalyticsData,
  RevenueStatsData,
  TopUser,
} from '../../models/dashboard.model';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    BaseChartDirective,
    FormatNumber,
    Pluralize,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  private adminDashboardService = inject(AdminDashboardService);
  private toastr = inject(ToastrService);

  isLoading = signal(false);
  isRefreshing = signal(false);

  dashboardData: AdminDashboardData | null = null;
  revenueStatsData: RevenueStatsData | null = null;
  bookingAnalyticsData: BookingAnalyticsData | null = null;
  topUsers: TopUser[] = [];

  dateRange = {
    startDate: this.getDefaultStartDate(),
    endDate: this.getDefaultEndDate(),
  };

  revenueChartData: ChartData<'line'> = {
    labels: [],
    datasets: [],
  };

  revenueChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Revenue (₦)',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ₦${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  eventStatusChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [],
  };

  eventStatusChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;

            const data = context.dataset.data as number[];
            const total = data.reduce((a, b) => a + (b || 0), 0);

            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  bookingTrendsChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  bookingTrendsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Bookings',
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  bookingsByDayChartData: ChartData<'radar'> = {
    labels: [],
    datasets: [],
  };

  bookingsByDayChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Bookings',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  ngOnInit() {
    this.loadDashboardData();
  }

  private getDefaultStartDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  }

  private getDefaultEndDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  loadDashboardData() {
    this.isLoading.set(true);

    this.adminDashboardService.getAdminDashboard().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.setupEventStatusChart();
        this.setupBookingTrendsChart();
      },
      error: (error) => {
        this.toastr.error('Failed to load dashboard data: ' + error.message);
      },
    });

    this.loadRevenueStats();
    this.loadBookingAnalytics();
    this.loadTopUsers();
  }

  loadRevenueStats() {
    this.adminDashboardService
      .getAdminRevenueStats({
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate,
      })
      .subscribe({
        next: (response) => {
          this.revenueStatsData = response.data;
          this.setupRevenueChart();
          this.isLoading.set(false);
        },
        error: (error) => {
          this.toastr.error('Failed to load revenue stats: ' + error.message);
          this.isLoading.set(false);
        },
      });
  }

  loadBookingAnalytics() {
    this.adminDashboardService
      .getAdminBookingAnalytics({
        startDate: this.dateRange.startDate,
        endDate: this.dateRange.endDate,
      })
      .subscribe({
        next: (response) => {
          this.bookingAnalyticsData = response.data;
          this.setupBookingsByDayChart();
        },
        error: (error) => {
          this.toastr.error(
            'Failed to load booking analytics: ' + error.message
          );
        },
      });
  }

  loadTopUsers() {
    this.adminDashboardService.getAdminTopUsersByBookings().subscribe({
      next: (response) => {
        this.topUsers = response.data;
      },
      error: (error) => {
        this.toastr.error('Failed to load top users: ' + error.message);
      },
    });
  }

  refreshDashboard() {
    this.isRefreshing.set(true);
    this.loadDashboardData();

    setTimeout(() => {
      this.isRefreshing.set(false);
    }, 1000);
  }

  onDateRangeChange() {
    this.loadRevenueStats();
    this.loadBookingAnalytics();
  }

  public setupRevenueChart() {
    if (!this.revenueStatsData) return;

    interface RevenueStat {
      date: Date;
      totalRevenue: number;
      totalBookings: number;
    }

    const labels: string[] = this.revenueStatsData.revenueStats.map(
      (stat: RevenueStat) =>
        new Date(stat.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
    );

    const revenueData = this.revenueStatsData.revenueStats.map(
      (stat: RevenueStat) => stat.totalRevenue
    );

    this.revenueChartData = {
      labels,
      datasets: [
        {
          label: 'Revenue (₦)',
          data: revenueData,
          borderColor: '#007bff',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }

  public setupEventStatusChart() {
    if (!this.dashboardData) return;

    const statusData = this.dashboardData.eventStatusDistribution;
    interface EventStatusDistributionItem {
      _id: string;
      count: number;
    }

    const labels: string[] = statusData.map(
      (item: EventStatusDistributionItem) =>
        item._id.charAt(0).toUpperCase() + item._id.slice(1)
    );
    const data = statusData.map(
      (item: EventStatusDistributionItem) => item.count
    );

    this.eventStatusChartData = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }

  public setupBookingTrendsChart() {
    if (!this.dashboardData) return;

    const monthlyData = this.dashboardData.monthlyRevenue;
    interface MonthlyRevenueItem {
      year: number;
      month: number;
      bookings: number;
      revenue: number;
    }
    const labels = monthlyData.map((item: MonthlyRevenueItem) =>
      new Date(item.year, item.month - 1).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    );

    const bookingsData = monthlyData.map(
      (item: MonthlyRevenueItem) => item.bookings
    );

    this.bookingTrendsChartData = {
      labels,
      datasets: [
        {
          label: 'Bookings',
          data: bookingsData,
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 1,
        },
      ],
    };
  }

  public setupBookingsByDayChart() {
    if (!this.bookingAnalyticsData) return;

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const bookingsData = new Array(7).fill(0);

    interface BookingsByDayOfWeekItem {
      _id: number;
      count: number;
    }

    (
      this.bookingAnalyticsData.bookingsByDayOfWeek as BookingsByDayOfWeekItem[]
    ).forEach((item: BookingsByDayOfWeekItem) => {
      const dayIndex: number = item._id - 1;
      bookingsData[dayIndex] = item.count;
    });

    this.bookingsByDayChartData = {
      labels: daysOfWeek,
      datasets: [
        {
          label: 'Bookings',
          data: bookingsData,
          backgroundColor: 'rgba(0, 123, 255, 0.2)',
          borderColor: '#007bff',
          borderWidth: 2,
          pointBackgroundColor: '#007bff',
        },
      ],
    };
  }
}
