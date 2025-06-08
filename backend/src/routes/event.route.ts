import { Router } from "express";
import Joi from "../middlewares/validator.middleware";
import eventValidator from "../validations/event.validator";
import EventService from "../services/event.service";
import AuthMiddleware from "../middlewares/auth.middleware";

class EventRoute {
  public loadRoutes(prefix: string, router: Router) {
    this.createEvent(prefix, router);
    this.getAllEvents(prefix, router);
    this.getEventById(prefix, router);
    this.updateEvent(prefix, router);
    this.deleteEvent(prefix, router);
    // this.getEventsByCategory(prefix, router);
  }

  private createEvent(prefix: string, router: Router) {
    router.post(
      `${prefix}/create`,
      AuthMiddleware.auth,
      Joi.validator(eventValidator.createEvent),
      EventService.createEvent
    );
  }

  private getAllEvents(prefix: string, router: Router) {
    router.get(`${prefix}/`, EventService.getAllEvents);
  }

  private getEventById(prefix: string, router: Router) {
    router.get(`${prefix}/:id`, EventService.getEventById);
  }

  private updateEvent(prefix: string, router: Router) {
    router.put(
      `${prefix}/:id/update`,
      AuthMiddleware.auth,
      Joi.validator(eventValidator.updateEvent),
      EventService.updateEvent
    );
  }

  private deleteEvent(prefix: string, router: Router) {
    router.delete(
      `${prefix}/:id/delete`,
      AuthMiddleware.auth,
      EventService.deleteEvent
    );
  }

  // private getEventsByCategory(prefix: string, router: Router) {
  //   router.get(`${prefix}/categories/stats`, EventService.getEventsByCategory);
  // }
}

export default new EventRoute();
