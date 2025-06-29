import BookingModel from "../models/booking.model";
import EventModel from "../models/event.model";
import { EventBookingUtils } from "../utilities/eventbooking.util";
import { RootController } from "./_root.control";

class EventController extends RootController {
  constructor() {
    super(EventModel, "Event");
  }

  async createEvent(data: any, organizerId: string) {
    try {
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

      let searchCriteria: any = { ...filter };

      if (queryParams.search) {
        searchCriteria.$or = [
          { name: { $regex: queryParams.search, $options: "i" } },
          { description: { $regex: queryParams.search, $options: "i" } },
          { venue: { $regex: queryParams.search, $options: "i" } },
          { category: { $regex: queryParams.search, $options: "i" } },
        ];
      }

      if (queryParams.category) {
        searchCriteria.category = queryParams.category;
      }

      if (queryParams.status) {
        searchCriteria.status = queryParams.status;
      }

      if (queryParams.priceFilter) {
        if (queryParams.priceFilter === "free") {
          searchCriteria.isFree = true;
        } else if (queryParams.priceFilter === "paid") {
          searchCriteria.isFree = false;
        }
      }

      let sortCriteria: any = { createdAt: -1 };
      if (queryParams.sortBy) {
        switch (queryParams.sortBy) {
          case "date":
            sortCriteria = { date: 1 };
            break;
          case "name":
            sortCriteria = { name: 1 };
            break;
          case "price":
            sortCriteria = { price: 1 };
            break;
          default:
            sortCriteria = { createdAt: -1 };
        }
      }

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
      const event = await EventBookingUtils.findEventById(eventId);

      if (event.status === "completed") {
        throw new Error("Completed events cannot be updated");
      }

      const eventDate = new Date(event.date);
      const currentDate = new Date();
      if (eventDate < currentDate) {
        throw new Error("Past events cannot be updated");
      }

      if (event.organizer.toString() !== userId) {
        throw new Error("You are not authorized to update this event");
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
      const event = await EventBookingUtils.findEventById(eventId);

      if (event.organizer.toString() !== userId) {
        throw new Error("You are not authorized to delete this event");
      }

      await this.model.findByIdAndDelete(eventId);
      return { message: "Event deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async toggleEventStatus(eventId: string, userId: string) {
    try {
      const event = await EventBookingUtils.findEventById(eventId);

      if (event.status === "completed") {
        throw new Error("Completed events cannot have their status changed");
      }

      const eventDate = new Date(event.date);
      const currentDate = new Date();
      if (eventDate < currentDate) {
        throw new Error("Past events cannot have their status changed");
      }

      if (event.organizer.toString() !== userId) {
        throw new Error("You are not authorized to update this event");
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
