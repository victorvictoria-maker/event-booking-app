import { Request, Response } from "express";
import { RootService } from "./_root.service";
import { Status } from "../interfaces/status.interface";
import BookingController from "../controllers/booking.control";

const { SUCCESS, ERROR, CREATED, NOT_FOUND } = Status;

class BookingService extends RootService {
  createBooking = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const data = await BookingController.createBooking(req.body, userId);

      this.sendResponse({
        req,
        res,
        status: CREATED,
        data,
        message: "Booking created successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to create booking",
        data,
        error,
      });
    }
  };

  cancelBooking = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const data = await BookingController.cancelBooking(id, userId);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to cancel booking",
        data,
        error,
      });
    }
  };

  getUserBookings = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const data = await BookingController.getUserBookings(userId, req.query);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "User bookings retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve user bookings",
        data,
        error,
      });
    }
  };

  getBookingById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const data = await BookingController.getBookingById(id, userId);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Booking retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || NOT_FOUND,
        message: message || "Booking not found",
        data,
        error,
      });
    }
  };

  getEventBookings = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const userId = (req as any).user.userId;
      const data = await BookingController.getEventBookings();

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Event bookings retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve event bookings",
        data,
        error,
      });
    }
  };

  getBookingStats = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const data = await BookingController.getBookingStats(userId);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Booking statistics retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve booking statistics",
        data,
        error,
      });
    }
  };
}

export default new BookingService();
