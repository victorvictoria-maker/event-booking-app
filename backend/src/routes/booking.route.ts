import { Router } from "express";
import Joi from "../middlewares/validator.middleware";
import BookingService from "../services/booking.service";
import AuthMiddleware from "../middlewares/auth.middleware";
import bookingValidator from "../validations/booking.validator";

class BookingRoute {
  public loadRoutes(prefix: string, router: Router) {
    this.createBooking(prefix, router);
    this.cancelBooking(prefix, router);
    this.getUserBookings(prefix, router);
    this.getBookingById(prefix, router);
    this.getAllBookings(prefix, router);
    this.getBookingStats(prefix, router);
  }

  private createBooking(prefix: string, router: Router) {
    router.post(
      `${prefix}/create`,
      AuthMiddleware.userOnly,
      Joi.validator(bookingValidator.createBooking),
      BookingService.createBooking
    );
  }

  private cancelBooking(prefix: string, router: Router) {
    router.delete(
      `${prefix}/:id/cancel`,
      AuthMiddleware.userOnly,
      BookingService.cancelBooking
    );
  }

  private getUserBookings(prefix: string, router: Router) {
    router.get(
      `${prefix}/my-bookings`,
      AuthMiddleware.userOnly,
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

  private getAllBookings(prefix: string, router: Router) {
    router.get(
      `${prefix}/`,
      AuthMiddleware.adminOnly,
      BookingService.getAllBookings
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
