import { Request, Response } from "express";
import { RootService } from "./_root.service";
import { Status } from "../interfaces/status.interface";
import DashboardController from "../controllers/dashboard.control";

const { SUCCESS, ERROR } = Status;

class DashboardService extends RootService {
  getUserDashboard = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const data = await DashboardController.getUserDashboard(userId);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "User dashboard data retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve user dashboard data",
        data,
        error,
      });
    }
  };

  getAdminDashboard = async (req: Request, res: Response) => {
    try {
      const data = await DashboardController.getAdminDashboard();

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Admin dashboard data retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve admin dashboard data",
        data,
        error,
      });
    }
  };

  getAdminRevenueStats = async (req: Request, res: Response) => {
    try {
      const data = await DashboardController.getAdminRevenueStats(req.query);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Admin revenue statistics retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve admin revenue statistics",
        data,
        error,
      });
    }
  };

  getAdminBookingAnalytics = async (req: Request, res: Response) => {
    try {
      const data = await DashboardController.getAdminBookingAnalytics(
        req.query
      );

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Admin booking analytics retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve admin booking analytics",
        data,
        error,
      });
    }
  };

  getAdminTopUsersByBookings = async (req: Request, res: Response) => {
    try {
      const data = await DashboardController.getAdminTopUsersByBookings();

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Top users gotten successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve top users",
        data,
        error,
      });
    }
  };
}

export default new DashboardService();
