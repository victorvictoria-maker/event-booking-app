import mongoose from "mongoose";
import BookingModel from "../models/booking.model";
import EventModel from "../models/event.model";
import { RootController } from "./_root.control";

class DashboardController extends RootController {
  constructor() {
    super(BookingModel, "Dashboard");
  }

  async getUserDashboard(userId: string) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const bookingStats = await BookingModel.aggregate([
        { $match: { user: userObjectId } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalAmountSpent: { $sum: "$totalAmount" },
          },
        },
      ]);

      const recentBookings = await BookingModel.find({ user: userObjectId })
        .populate("event", "name date venue category status")
        .sort({ createdAt: -1 })
        .limit(5)
        .exec();

      const upcomingEvents = await BookingModel.find({ user: userObjectId })
        .populate({
          path: "event",
          match: { date: { $gte: new Date() }, status: "active" },
          select: "name date venue category",
        })
        .sort({ "event.date": 1 })
        .limit(5)
        .exec();

      const filteredUpcomingEvents = upcomingEvents.filter(
        (booking) => booking.event
      );

      const bookingTrends = await BookingModel.aggregate([
        { $match: { user: userObjectId } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            amount: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
        { $limit: 12 },
      ]);

      const favoriteCategories = await BookingModel.aggregate([
        { $match: { user: userObjectId } },
        {
          $lookup: {
            from: "events",
            localField: "event",
            foreignField: "_id",
            as: "eventDetails",
          },
        },
        { $unwind: "$eventDetails" },
        {
          $group: {
            _id: "$eventDetails.category",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]);

      const stats = bookingStats[0] || {
        totalBookings: 0,
        totalAmountSpent: 0,
      };

      return {
        overview: {
          totalBookings: stats.totalBookings,
          totalAmountSpent: stats.totalAmountSpent,
          upcomingEvents: filteredUpcomingEvents.length,
        },
        recentBookings,
        upcomingEvents: filteredUpcomingEvents,
        bookingTrends,
        favoriteCategories,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminDashboard() {
    try {
      const totalEvents = await EventModel.countDocuments();
      const totalBookings = await BookingModel.countDocuments();
      const totalRevenue = await BookingModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalAmount" },
          },
        },
      ]);

      const mostPopularEvents = await BookingModel.aggregate([
        {
          $group: {
            _id: "$event",
            bookingCount: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { bookingCount: -1 } },
        { $limit: 6 },
        {
          $lookup: {
            from: "events",
            localField: "_id",
            foreignField: "_id",
            as: "eventDetails",
          },
        },
        { $unwind: "$eventDetails" },
      ]);

      const recentBookings = await BookingModel.find()
        .populate("user", "username email")
        .populate("event", "name date venue")
        .sort({ createdAt: -1 })
        .limit(5)
        .exec();

      const eventStatusDistribution = await EventModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { _id: 1 },
        },
      ]);

      const now = new Date();
      const twelveMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 11,
        1
      );

      const monthlyRevenue = await BookingModel.aggregate([
        { $match: { createdAt: { $gte: twelveMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$totalAmount" },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const filledMonthlyRevenue = [];
      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const found = monthlyRevenue.find(
          (m) => m._id.year === year && m._id.month === month
        );

        filledMonthlyRevenue.push({
          year,
          month,
          revenue: found ? found.revenue : 0,
          bookings: found ? found.bookings : 0,
        });
      }

      return {
        overview: {
          totalEvents,
          totalBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
          mostPopularEvents: mostPopularEvents || [],
        },
        recentBookings,
        eventStatusDistribution,
        monthlyRevenue: filledMonthlyRevenue,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminRevenueStats(queryParams: any = {}) {
    try {
      const endDate = queryParams.endDate
        ? new Date(queryParams.endDate + "T23:59:59.999Z")
        : new Date();

      const startDate = queryParams.startDate
        ? new Date(queryParams.startDate + "T00:00:00.000Z")
        : new Date(endDate.getTime() - 29 * 24 * 60 * 60 * 1000);

      if (!queryParams.startDate) {
        startDate.setUTCHours(0, 0, 0, 0);
      }
      if (!queryParams.endDate) {
        endDate.setUTCHours(23, 59, 59, 999);
      }

      const revenueStats = await BookingModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalRevenue: { $sum: "$totalAmount" },
            totalBookings: { $sum: 1 },
            averageBookingValue: { $avg: "$totalAmount" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      const updatedRevenueStats = [];
      const current = new Date(startDate);

      while (current <= endDate) {
        const year = current.getUTCFullYear();
        const month = current.getUTCMonth() + 1;
        const day = current.getUTCDate();

        const found = revenueStats.find(
          (r) =>
            r._id.year === year && r._id.month === month && r._id.day === day
        );

        updatedRevenueStats.push({
          date: new Date(Date.UTC(year, month - 1, day)),
          totalRevenue: found ? found.totalRevenue : 0,
          totalBookings: found ? found.totalBookings : 0,
          averageBookingValue: found ? found.averageBookingValue : 0,
        });

        current.setUTCDate(current.getUTCDate() + 1);
      }

      return {
        dateRange: { startDate, endDate },
        revenueStats: updatedRevenueStats,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminBookingAnalytics(queryParams: any = {}) {
    try {
      const period = queryParams.period || "monthly";

      const endDate = queryParams.endDate
        ? new Date(queryParams.endDate + "T23:59:59.999Z")
        : new Date();

      const startDate = queryParams.startDate
        ? new Date(queryParams.startDate + "T00:00:00.000Z")
        : new Date(endDate.getTime() - 12 * 30 * 24 * 60 * 60 * 1000);

      if (!queryParams.startDate) {
        startDate.setUTCHours(0, 0, 0, 0);
      }
      if (!queryParams.endDate) {
        endDate.setUTCHours(23, 59, 59, 999);
      }

      const bookingTrends = await BookingModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);

      const bookingsByDayOfWeek = await BookingModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            count: { $sum: 1 },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return {
        period,
        dateRange: { startDate, endDate },
        bookingTrends,
        bookingsByDayOfWeek,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAdminTopUsersByBookings() {
    try {
      const topUsers = await BookingModel.aggregate([
        {
          $group: {
            _id: "$user",
            bookingCount: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
          },
        },
        { $sort: { bookingCount: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "userDetails",
          },
        },
        { $unwind: "$userDetails" },
      ]);

      return topUsers;
    } catch (error) {
      throw error;
    }
  }
}

export default new DashboardController();
