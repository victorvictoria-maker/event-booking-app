import { Router } from "express";
import DashboardService from "../services/dashboard.service";
import AuthMiddleware from "../middlewares/auth.middleware";

class DashboardRoute {
  public loadRoutes(prefix: string, router: Router) {
    this.getUserDashboard(prefix, router);
    this.getAdminDashboard(prefix, router);
    this.getAdminRevenueStats(prefix, router);
    this.getAdminBookingAnalytics(prefix, router);
    this.getAdminTopUsersByBookings(prefix, router);
  }

  private getUserDashboard(prefix: string, router: Router) {
    router.get(
      `${prefix}/user`,
      AuthMiddleware.userOnly,
      DashboardService.getUserDashboard
    );
  }

  private getAdminDashboard(prefix: string, router: Router) {
    router.get(
      `${prefix}/admin`,
      AuthMiddleware.adminOnly,
      DashboardService.getAdminDashboard
    );
  }

  private getAdminRevenueStats(prefix: string, router: Router) {
    router.get(
      `${prefix}/admin/revenue`,
      AuthMiddleware.adminOnly,
      DashboardService.getAdminRevenueStats
    );
  }

  private getAdminBookingAnalytics(prefix: string, router: Router) {
    router.get(
      `${prefix}/admin/bookings-analytics`,
      AuthMiddleware.adminOnly,
      DashboardService.getAdminBookingAnalytics
    );
  }

  private getAdminTopUsersByBookings(prefix: string, router: Router) {
    router.get(
      `${prefix}/admin/top-users`,
      AuthMiddleware.adminOnly,
      DashboardService.getAdminTopUsersByBookings
    );
  }
}

export default new DashboardRoute();
