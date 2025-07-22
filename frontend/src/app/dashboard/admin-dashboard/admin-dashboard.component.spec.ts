import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AdminDashboardService } from '../../services/dashboard.service';
import { of, throwError } from 'rxjs';
import {
  mockAdminDashboardData,
  mockRevenueStatsData,
  mockBookingAnalyticsData,
  mockTopUsers,
} from '../../test/mock-data';
import { TooltipModel } from 'chart.js';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockAdminDashboardService: jasmine.SpyObj<AdminDashboardService>;

  beforeEach(async () => {
    mockToastrService = jasmine.createSpyObj('ToastrService', [
      'success',
      'error',
    ]);

    mockAdminDashboardService = jasmine.createSpyObj('AdminDashboardService', [
      'getAdminDashboard',
      'getAdminRevenueStats',
      'getAdminBookingAnalytics',
      'getAdminTopUsersByBookings',
    ]);

    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, ToastrModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: ToastrService, useValue: mockToastrService },
        { provide: AdminDashboardService, useValue: mockAdminDashboardService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;

    mockAdminDashboardService.getAdminDashboard.and.returnValue(
      of({ data: mockAdminDashboardData })
    );
    mockAdminDashboardService.getAdminRevenueStats.and.returnValue(
      of({ data: mockRevenueStatsData })
    );
    mockAdminDashboardService.getAdminBookingAnalytics.and.returnValue(
      of({ data: mockBookingAnalyticsData })
    );
    mockAdminDashboardService.getAdminTopUsersByBookings.and.returnValue(
      of({ data: mockTopUsers })
    );
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.isLoading()).toBe(false);
      expect(component.isRefreshing()).toBe(false);
      expect(component.dashboardData).toBeNull();
      expect(component.revenueStatsData).toBeNull();
      expect(component.bookingAnalyticsData).toBeNull();
      expect(component.topUsers).toEqual([]);
    });

    it('should set default date range', () => {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      expect(component.dateRange.endDate).toBe(
        today.toISOString().split('T')[0]
      );
      expect(component.dateRange.startDate).toBe(
        thirtyDaysAgo.toISOString().split('T')[0]
      );
    });

    it('should call loadDashboardData on ngOnInit', () => {
      spyOn(component, 'loadDashboardData');

      component.ngOnInit();

      expect(component.loadDashboardData).toHaveBeenCalled();
    });
  });

  describe('loadDashboardData', () => {
    it('should load all dashboard data successfully', () => {
      spyOn(component, 'setupEventStatusChart');
      spyOn(component, 'setupBookingTrendsChart');
      spyOn(component, 'loadRevenueStats');
      spyOn(component, 'loadBookingAnalytics');
      spyOn(component, 'loadTopUsers');

      component.loadDashboardData();

      expect(component.isLoading()).toBe(true);
      expect(mockAdminDashboardService.getAdminDashboard).toHaveBeenCalled();
      expect(component.dashboardData).toEqual(mockAdminDashboardData);
      expect(component.setupEventStatusChart).toHaveBeenCalled();
      expect(component.setupBookingTrendsChart).toHaveBeenCalled();
      expect(component.loadRevenueStats).toHaveBeenCalled();
      expect(component.loadBookingAnalytics).toHaveBeenCalled();
      expect(component.loadTopUsers).toHaveBeenCalled();
    });

    it('should handle dashboard data loading error', () => {
      const errorMessage = 'Failed to load dashboard';
      mockAdminDashboardService.getAdminDashboard.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );
      spyOn(component, 'loadRevenueStats');

      component.loadDashboardData();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load dashboard data: ' + errorMessage
      );
      expect(component.loadRevenueStats).toHaveBeenCalled();
    });
  });

  describe('loadRevenueStats', () => {
    it('should load revenue stats successfully', () => {
      spyOn(component, 'setupRevenueChart');

      component.loadRevenueStats();

      expect(
        mockAdminDashboardService.getAdminRevenueStats
      ).toHaveBeenCalledWith({
        startDate: component.dateRange.startDate,
        endDate: component.dateRange.endDate,
      });
      expect(component.revenueStatsData).toEqual(mockRevenueStatsData);
      expect(component.setupRevenueChart).toHaveBeenCalled();
      expect(component.isLoading()).toBe(false);
    });

    it('should handle revenue stats loading error', () => {
      const errorMessage = 'Failed to load revenue';
      mockAdminDashboardService.getAdminRevenueStats.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadRevenueStats();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load revenue stats: ' + errorMessage
      );
      expect(component.isLoading()).toBe(false);
    });
  });

  describe('loadBookingAnalytics', () => {
    it('should load booking analytics successfully', () => {
      spyOn(component, 'setupBookingsByDayChart');

      component.loadBookingAnalytics();

      expect(
        mockAdminDashboardService.getAdminBookingAnalytics
      ).toHaveBeenCalledWith({
        startDate: component.dateRange.startDate,
        endDate: component.dateRange.endDate,
      });
      expect(component.bookingAnalyticsData).toEqual(mockBookingAnalyticsData);
      expect(component.setupBookingsByDayChart).toHaveBeenCalled();
    });

    it('should handle booking analytics loading error', () => {
      const errorMessage = 'Failed to load analytics';
      mockAdminDashboardService.getAdminBookingAnalytics.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadBookingAnalytics();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load booking analytics: ' + errorMessage
      );
    });
  });

  describe('loadTopUsers', () => {
    it('should load top users successfully', () => {
      component.loadTopUsers();

      expect(
        mockAdminDashboardService.getAdminTopUsersByBookings
      ).toHaveBeenCalled();
      expect(component.topUsers).toEqual(mockTopUsers);
    });

    it('should handle top users loading error', () => {
      const errorMessage = 'Failed to load users';
      mockAdminDashboardService.getAdminTopUsersByBookings.and.returnValue(
        throwError(() => ({ message: errorMessage }))
      );

      component.loadTopUsers();

      expect(mockToastrService.error).toHaveBeenCalledWith(
        'Failed to load top users: ' + errorMessage
      );
    });
  });

  describe('refreshDashboard', () => {
    it('should refresh dashboard and reset refreshing state', () => {
      spyOn(component, 'loadDashboardData');
      jasmine.clock().install();

      component.refreshDashboard();

      expect(component.isRefreshing()).toBe(true);
      expect(component.loadDashboardData).toHaveBeenCalled();

      jasmine.clock().tick(1001);
      expect(component.isRefreshing()).toBe(false);

      jasmine.clock().uninstall();
    });
  });

  describe('onDateRangeChange', () => {
    it('should reload revenue stats and booking analytics', () => {
      spyOn(component, 'loadRevenueStats');
      spyOn(component, 'loadBookingAnalytics');

      component.onDateRangeChange();

      expect(component.loadRevenueStats).toHaveBeenCalled();
      expect(component.loadBookingAnalytics).toHaveBeenCalled();
    });
  });

  describe('Chart Setup Methods', () => {
    beforeEach(() => {
      component.revenueStatsData = mockRevenueStatsData;
      component.dashboardData = mockAdminDashboardData;
      component.bookingAnalyticsData = mockBookingAnalyticsData;
    });

    describe('setupRevenueChart', () => {
      it('should setup revenue chart with data', () => {
        component['setupRevenueChart']();

        expect(component.revenueChartData.datasets[0].data).toEqual([100, 150]);
        expect(component.revenueChartData.datasets[0].label).toBe(
          'Revenue (₦)'
        );
      });

      it('should not setup chart when no revenue data', () => {
        component.revenueStatsData = null;

        component['setupRevenueChart']();

        expect(component.revenueChartData.labels).toEqual([]);
      });
    });

    describe('setupEventStatusChart', () => {
      it('should setup event status chart with data', () => {
        component['setupEventStatusChart']();

        expect(component.eventStatusChartData.labels).toEqual([
          'Active',
          'Inactive',
        ]);
        expect(component.eventStatusChartData.datasets[0].data).toEqual([8, 2]);
        expect(
          component.eventStatusChartData.datasets[0].backgroundColor
        ).toEqual(['#28a745', '#dc3545', '#ffc107']);
      });

      it('should not setup chart when no dashboard data', () => {
        component.dashboardData = null;

        component['setupEventStatusChart']();

        expect(component.eventStatusChartData.labels).toEqual([]);
      });
    });

    describe('setupBookingTrendsChart', () => {
      it('should setup booking trends chart with data', () => {
        component['setupBookingTrendsChart']();

        expect(component.bookingTrendsChartData.datasets[0].data).toEqual([10]);
        expect(component.bookingTrendsChartData.datasets[0].label).toBe(
          'Bookings'
        );
      });

      it('should not setup chart when no dashboard data', () => {
        component.dashboardData = null;

        component['setupBookingTrendsChart']();

        expect(component.bookingTrendsChartData.labels).toEqual([]);
      });
    });

    describe('setupBookingsByDayChart', () => {
      it('should setup bookings by day chart with data', () => {
        component['setupBookingsByDayChart']();

        const expectedDays = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        expect(component.bookingsByDayChartData.labels).toEqual(expectedDays);
        expect(component.bookingsByDayChartData.datasets[0].data).toEqual([
          3, 2, 0, 0, 0, 0, 0,
        ]);
        expect(component.bookingsByDayChartData.datasets[0].label).toBe(
          'Bookings'
        );
      });

      it('should not setup chart when no booking analytics data', () => {
        component.bookingAnalyticsData = null;

        component['setupBookingsByDayChart']();

        expect(component.bookingsByDayChartData.labels).toEqual([]);
      });
    });
  });

  describe('Chart Options', () => {
    it('should have correct revenue chart options', () => {
      expect(component.revenueChartOptions?.responsive).toBe(true);
      expect(component.revenueChartOptions?.maintainAspectRatio).toBe(false);
      expect(component.revenueChartOptions?.plugins?.legend?.display).toBe(
        true
      );
    });

    it('should have correct event status chart options', () => {
      expect(component.eventStatusChartOptions?.responsive).toBe(true);
      expect(component.eventStatusChartOptions?.maintainAspectRatio).toBe(
        false
      );
      expect(component.eventStatusChartOptions?.plugins?.legend?.position).toBe(
        'bottom'
      );
    });
  });

  describe('Chart Tooltip Callbacks', () => {
    let tooltipThisContext: TooltipModel<'bar'>;

    beforeEach(() => {
      tooltipThisContext = {} as TooltipModel<'bar'>;
    });

    it('should format revenue chart tooltip correctly', () => {
      const callback =
        component.revenueChartOptions?.plugins?.tooltip?.callbacks?.label;

      const context = {
        dataset: { label: 'Revenue (₦)' },
        parsed: { y: 1000 },
      };

      const result = callback?.call(tooltipThisContext, context as any);
      expect(result).toBe('Revenue (₦): ₦1,000');
    });

    it('should format event status chart tooltip correctly', () => {
      const callback =
        component.eventStatusChartOptions?.plugins?.tooltip?.callbacks?.label;

      const context = {
        label: 'Active',
        parsed: 8,
        dataset: { data: [8, 2] },
      };

      const result = callback?.call(tooltipThisContext, context as any);
      expect(result).toBe('Active: 8 (80.0%)');
    });

    it('should handle event status chart tooltip with zero total', () => {
      const callback =
        component.eventStatusChartOptions?.plugins?.tooltip?.callbacks?.label;

      const context = {
        label: 'Active',
        parsed: 0,
        dataset: { data: [0, 0] },
      };

      const result = callback?.call(tooltipThisContext, context as any);
      expect(result).toBe('Active: 0 (0.0%)');
    });
  });
});
