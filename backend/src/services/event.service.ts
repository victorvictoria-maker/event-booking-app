import { Request, Response } from "express";
import { RootService } from "./_root.service";
import { Status } from "../interfaces/status.interface";
import EventController from "../controllers/event.control";

const { SUCCESS, ERROR, CREATED, NOT_FOUND } = Status;

class EventService extends RootService {
  getAllEvents = async (req: Request, res: Response) => {
    try {
      const data = await EventController.getAllEvents({}, req.query, [
        { path: "organizer", select: "username email" },
      ]);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Events retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to retrieve events",
        data,
        error,
      });
    }
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await EventController.getEventById(id);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Event retrieved successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || NOT_FOUND,
        message: message || "Event not found",
        data,
        error,
      });
    }
  };

  createEvent = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.userId;
      const data = await EventController.createEvent(req.body, userId);

      this.sendResponse({
        req,
        res,
        status: CREATED,
        data,
        message: "Event created successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to create event",
        data,
        error,
      });
    }
  };

  updateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const isAdmin = (req as any).user.isAdmin || false;

      const data = await EventController.updateEvent(
        id,
        req.body,
        userId,
        isAdmin
      );

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Event updated successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to update event",
        data,
        error,
      });
    }
  };

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const isAdmin = (req as any).user.isAdmin || false;

      const data = await EventController.deleteEvent(id, userId, isAdmin);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Event deleted successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to delete event",
        data,
        error,
      });
    }
  };

  toggleEventStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;
      const isAdmin = (req as any).user.isAdmin || false;

      const data = await EventController.toggleEventStatus(id, userId, isAdmin);

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Event status toggled successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to toggle event status",
        data,
        error,
      });
    }
  };

  getEventsByCategory = async (req: Request, res: Response) => {
    try {
      const data = await EventController.getEventsByCategory();

      this.sendResponse({
        req,
        res,
        status: SUCCESS,
        data,
        message: "Events by category gotten successfully",
      });
    } catch (error) {
      const { status, message, data } = this.get_error(error);
      this.sendResponse({
        req,
        res,
        status: status || ERROR,
        message: message || "Failed to get events by category",
        data,
        error,
      });
    }
  };
}

export default new EventService();
