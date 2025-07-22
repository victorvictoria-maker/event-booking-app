import mongoose from "mongoose";
import BookingModel from "../models/booking.model";
import EventModel from "../models/event.model";
import { RootController } from "./_root.control";
import { EventBookingUtils } from "../utilities/eventbooking.util";

class BookingController extends RootController {
  constructor() {
    super(BookingModel, "Booking");
  }

  async createBooking(bookingData: any, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { eventId } = bookingData;
      const event = await EventModel.findById(eventId).session(session);
      if (!event) {
        throw new Error("Event not found");
      }

      if (event.status !== "active") {
        throw new Error("Event is not available for booking");
      }

      const bookedSeats = await BookingModel.countDocuments({
        event: eventId,
      }).session(session);

      const availableSeats = event.totalSeats - bookedSeats;

      if (availableSeats <= 0) {
        throw new Error("No more available seats for this event");
      }

      const existingBooking = await BookingModel.findOne({
        user: userId,
        event: eventId,
      }).session(session);

      if (existingBooking) {
        throw new Error("You have already booked this event");
      }

      const totalAmount = event.isFree ? 0 : event.price;

      const booking = new BookingModel({
        user: userId,
        event: eventId,
        totalAmount,
        paymentStatus: "paid",
      });

      const savedBooking = await booking.save({ session });

      const bookingResponse = await BookingModel.findById(savedBooking._id)
        .session(session)
        .populate("user", "username email")
        .populate("event", "name date venue price isFree totalSeats");

      if (bookingResponse) {
        const eventBookedSeats = await BookingModel.countDocuments({
          event: eventId,
        }).session(session);
        const eventAvailableSeats = event.totalSeats - eventBookedSeats;

        await session.commitTransaction();

        const response = bookingResponse.toJSON();
        if (response.event) {
          response.event.bookedSeats = eventBookedSeats;
          response.event.availableSeats = eventAvailableSeats;
        }

        return response;
      }

      return bookingResponse ? (bookingResponse as any).toJSON() : null;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async cancelBooking(bookingId: string, userId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await EventBookingUtils.findBookingById(bookingId);

      const event = await EventModel.findById(booking.event).session(session);
      if (!event) {
        throw new Error("Associated event not found");
      }

      await BookingModel.findByIdAndDelete(bookingId, { session });

      await session.commitTransaction();

      return {
        message: "Booking cancelled successfully",
      };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getUserBookings(userId: string, queryParams: any = {}) {
    try {
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 10;
      const skip = (page - 1) * limit;

      const searchCriteria: any = { user: userId };

      const sortCriteria: { [key: string]: mongoose.SortOrder } = {
        createdAt: -1,
      };

      const bookings = await BookingModel.find(searchCriteria)
        .populate("event", "name date time venue price isFree category status")
        .skip(skip)
        .limit(limit)
        .sort(sortCriteria)
        .exec();

      const total = await BookingModel.countDocuments(searchCriteria);

      return {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getBookingById(bookingId: string, userId: string) {
    try {
      const booking = await BookingModel.findById(bookingId)
        .populate("user", "username email")
        .populate(
          "event",
          "name description date venue price isFree category totalSeats organizer"
        )
        .exec();

      if (!booking) {
        throw new Error("Booking not found");
      }

      return booking.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async getAllBookings(queryParams: any = {}) {
    try {
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 10;
      const skip = (page - 1) * limit;

      const searchCriteria: any = {};

      const bookings = await BookingModel.find(searchCriteria)
        .populate("user", "username email")
        .populate("event", "name date time venue price isFree category status")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      const total = await BookingModel.countDocuments(searchCriteria);

      return {
        bookings,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getBookingStats(userId: string) {
    try {
      const stats = await BookingModel.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            totalAmount: { $sum: "$totalAmount" },
          },
        },
      ]);

      return (
        stats[0] || {
          totalBookings: 0,
          totalAmount: 0,
        }
      );
    } catch (error) {
      throw error;
    }
  }
}

export default new BookingController();
