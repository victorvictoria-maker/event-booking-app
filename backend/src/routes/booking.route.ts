import { Router } from "express";
import Joi from "../middlewares/validator.middleware";
// import bookingValidator from "../validations/booking.validator";
import BookingService from "../services/booking.service";
import AuthMiddleware from "../middlewares/auth.middleware";
import bookingValidator from "../validations/booking.validator";

class BookingRoute {
  public loadRoutes(prefix: string, router: Router) {
    this.createBooking(prefix, router);
    this.cancelBooking(prefix, router);
    this.getUserBookings(prefix, router);
    this.getBookingById(prefix, router);
    this.getEventBookings(prefix, router);
    this.getBookingStats(prefix, router);
  }

  private createBooking(prefix: string, router: Router) {
    router.post(
      `${prefix}/create`,
      AuthMiddleware.auth,
      Joi.validator(bookingValidator.createBooking),
      BookingService.createBooking
    );
  }

  private cancelBooking(prefix: string, router: Router) {
    router.delete(
      `${prefix}/:id/cancel`,
      AuthMiddleware.auth,
      BookingService.cancelBooking
    );
  }

  private getUserBookings(prefix: string, router: Router) {
    router.get(
      `${prefix}/my-bookings`,
      AuthMiddleware.auth,
      BookingService.getUserBookings
    );
  }

  private getBookingById(prefix: string, router: Router) {
    router.get(
      `${prefix}/:id`,
      AuthMiddleware.auth,
      BookingService.getBookingById
    );
  }

  private getEventBookings(prefix: string, router: Router) {
    router.get(
      `${prefix}/event/:eventId`,
      AuthMiddleware.auth,
      BookingService.getEventBookings
    );
  }

  private getBookingStats(prefix: string, router: Router) {
    router.get(
      `${prefix}/stats`,
      AuthMiddleware.auth,
      BookingService.getBookingStats
    );
  }
}

export default new BookingRoute();
