import EventModel from "../models/event.model";
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
        availableSeats: data.totalSeats,
        bookedSeats: 0,
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

      const events = await query.exec();
      const total = await this.model.countDocuments(searchCriteria);

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

      return event.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async updateEvent(
    eventId: string,
    updateData: any,
    userId: string,
    isAdmin: boolean = false
  ) {
    try {
      const event = await findEventById(eventId);

      if (updateData.date) {
        this.validateFutureDate(updateData.date, "Event date");
      }

      // if (!isAdmin && event.organizer.toString() !== userId) {
      //   throw new Error("You are not authorized to update this event");
      // }

      if (updateData.totalSeats) {
        const currentBookedSeats = event.bookedSeats;
        if (updateData.totalSeats < currentBookedSeats) {
          throw new Error(
            "Total seats cannot be less than currently booked seats"
          );
        }
        updateData.availableSeats = updateData.totalSeats - currentBookedSeats;
      }

      if (updateData.price !== undefined) {
        updateData.isFree = updateData.price === 0;
      }

      const updatedEvent = await this.model.findByIdAndUpdate(
        eventId,
        updateData,
        { new: true, runValidators: true }
      );

      return updatedEvent?.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async deleteEvent(eventId: string, userId: string, isAdmin: boolean = false) {
    try {
      const event = await findEventById(eventId);

      // if (!isAdmin && event.organizer.toString() !== userId) {
      //   throw new Error("You are not authorized to delete this event");
      // }

      await this.model.findByIdAndDelete(eventId);
      return { message: "Event deleted successfully" };
    } catch (error) {
      throw error;
    }
  }

  async toggleEventStatus(
    eventId: string,
    userId: string,
    isAdmin: boolean = false
  ) {
    try {
      const event = await findEventById(eventId);

      // if (!isAdmin && event.organizer.toString() !== userId) {
      //   throw new Error("You are not authorized to update this event");
      // }

      const newStatus = event.status === "active" ? "cancelled" : "active";
      const updatedEvent = await this.model.findByIdAndUpdate(
        eventId,
        { status: newStatus },
        { new: true }
      );

      return updatedEvent?.toJSON();
    } catch (error) {
      throw error;
    }
  }

  async getEventsByCategory() {
    try {
      const categoryStats = await this.model.aggregate([
        {
          $match: {
            status: "active",
            date: { $gte: new Date() },
          },
        },
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
            totalSeats: { $sum: "$totalSeats" },
            bookedSeats: { $sum: "$bookedSeats" },
            averagePrice: { $avg: "$price" },
            events: {
              $push: {
                _id: "$_id",
                name: "$name",
                date: "$date",
                venue: "$venue",
                price: "$price",
                availableSeats: "$availableSeats",
              },
            },
          },
        },
        { $sort: { count: -1 } },
      ]);

      return categoryStats;
    } catch (error) {
      throw error;
    }
  }
}

export default new EventController();
