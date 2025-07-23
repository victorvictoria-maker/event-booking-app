import BookingModel from "../models/booking.model";
import EventModel from "../models/event.model";
import { EventBookingUtils } from "../utilities/eventbooking.util";
import { findEventById } from "../utilities/find-event-by-id";
import { getSearchCriteria } from "../utilities/search-criteria";
import { getSortCriteria } from "../utilities/sort-criteria";

import { RootController } from "./_root.control";

class EventController extends RootController {
  constructor() {
    super(EventModel, "Event");
  }

  private validateFutureDate(date: Date, fieldName: string = "date") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const inputDate = new Date(date);

    if (inputDate < tomorrow) {
      throw new Error(`${fieldName} must be in the future`);
    }
  }

  async createEvent(data: any, organizerId: string) {
    try {
      this.validateFutureDate(data.date, "Event date");

      const eventData = {
        ...data,
        organizer: organizerId,
        totalSeats: data.totalSeats,
        status: "active",
        isFree: data.price === 0,
      };

      const event = await this.model.create(eventData);
      return event.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async getAllEvents(
    filter: any = {},
    queryParams: any = {},
    populate: any[] = []
  ) {
    try {
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 10;
      const skip = (page - 1) * limit;

      const searchCriteria = getSearchCriteria(filter, queryParams);
      const sortCriteria = getSortCriteria(queryParams.sortBy);

      const query = this.model
        .find(searchCriteria)
        .skip(skip)
        .limit(limit)
        .sort(sortCriteria);

      if (populate && populate.length > 0) {
        populate.forEach((pop) => {
          query.populate(pop);
        });
      }

      const fetchedEvents = await query.exec();
      const total = await this.model.countDocuments(searchCriteria);

      const events = await Promise.all(
        fetchedEvents.map(async (event) => {
          const bookedSeats = await BookingModel.countDocuments({
            event: event._id,
          });
          const availableSeats = event.totalSeats - bookedSeats;

          return {
            ...event.toJSON(),
            bookedSeats,
            availableSeats,
          };
        })
      );

      return {
        events,
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

  async getEventById(eventId: string) {
    try {
      const event = await this.model
        .findById(eventId)
        .populate("organizer", "username email")
        .exec();

      if (!event) {
        throw new Error("Event not found");
      }

      // return event.toJSON();
      return await EventBookingUtils.addSeatsToEvent(event);
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(eventId: string, updateData: any, userId: string) {
    try {
      const event = await findEventById(eventId);

      if (event.status === "completed") {
        throw new Error("Completed events cannot be updated");
      }

      if (updateData.date) {
        this.validateFutureDate(updateData.date, "Event date");
      }

      if (updateData.totalSeats) {
        const currentBookedSeats = await BookingModel.countDocuments({
          event: eventId,
        });
        if (updateData.totalSeats < currentBookedSeats) {
          throw new Error(
            "Total seats cannot be less than currently booked seats"
          );
        }
      }

      if (updateData.price !== undefined) {
        updateData.isFree = updateData.price === 0;
      }

      const updatedEvent = await this.model.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true, runValidators: true }
      );

      return await EventBookingUtils.addSeatsToEvent(updatedEvent);
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(eventId: string, userId: string) {
    try {
      const event = await findEventById(eventId);

      await this.model.findByIdAndDelete(eventId);
      return { message: "Event deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async toggleEventStatus(eventId: string, userId: string) {
    try {
      const event = await findEventById(eventId);

      if (event.status === "completed") {
        throw new Error("Completed events cannot have their status changed");
      }

      const eventDate = new Date(event.date);
      const currentDate = new Date();
      if (eventDate < currentDate) {
        throw new Error("Past events cannot have their status changed");
      }

      const newStatus = event.status === "active" ? "cancelled" : "active";
      const updatedEvent = await this.model.findByIdAndUpdate(
        eventId,
        { status: newStatus },
        { new: true }
      );

      return await EventBookingUtils.addSeatsToEvent(updatedEvent);
    } catch (error) {
      throw error;
    }
  }

  async getEventStats() {
    try {
      const totalEvents = await this.model.countDocuments();

      const activeEvents = await this.model.countDocuments({
        status: "active",
      });

      const cancelledEvents = await this.model.countDocuments({
        status: "cancelled",
      });

      const completedEvents = await this.model.countDocuments({
        status: "completed",
      });

      const totalBookings = await BookingModel.countDocuments();

      const events = await this.model.find({}, "totalSeats").exec();
      const totalSeats = events.reduce(
        (sum, event) => sum + event.totalSeats,
        0
      );

      const totalBookedSeats = await BookingModel.countDocuments();
      const totalAvailableSeats = totalSeats - totalBookedSeats;

      const eventsByCategory = await this.model.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);

      const eventsByStatus = await this.model.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const freeEvents = await this.model.countDocuments({ isFree: true });
      const paidEvents = await this.model.countDocuments({ isFree: false });

      return {
        totalEvents,
        activeEvents,
        cancelledEvents,
        completedEvents,
        totalBookings,
        totalSeats,
        totalAvailableSeats,
        freeEvents,
        paidEvents,
        eventsByCategory,
        eventsByStatus,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new EventController();
