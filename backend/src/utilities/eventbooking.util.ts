import mongoose from "mongoose";
import BookingModel from "../models/booking.model";
import EventModel from "../models/event.model";

export class EventBookingUtils {
  static async findEventById(eventId: string) {
    const event = await EventModel.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  static async findBookingById(bookingId: string) {
    const booking = await BookingModel.findById(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }
    return booking;
  }

  static async getSeatsInfo(eventId: string) {
    const bookedSeats = await BookingModel.countDocuments({
      event: eventId,
    });

    const event = await EventModel.findById(eventId);
    const availableSeats = event ? event.totalSeats - bookedSeats : 0;

    return { bookedSeats, availableSeats };
  }

  static async addSeatsToEvent(event: any) {
    const { bookedSeats, availableSeats } = await this.getSeatsInfo(event._id);

    return {
      ...event.toJSON(),
      bookedSeats,
      availableSeats,
    };
  }
}
