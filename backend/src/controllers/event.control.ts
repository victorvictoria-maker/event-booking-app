import EventModel from "../models/event.model";
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

      let searchCriteria: any = { ...filter };

      if (queryParams.search) {
        searchCriteria.$or = [
          { name: { $regex: queryParams.search, $options: "i" } },
          { description: { $regex: queryParams.search, $options: "i" } },
          { location: { $regex: queryParams.search, $options: "i" } },
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
          case "popularity":
            sortCriteria = { bookedSeats: -1 };
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
      const event = await this.model.findById(eventId);
      if (!event) throw new Error("Event not found");

      if (!isAdmin && event.organizer.toString() !== userId) {
        throw new Error("You are not authorized to update this event");
      }

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
      const event = await this.model.findById(eventId);
      if (!event) throw new Error("Event not found");

      if (!isAdmin && event.organizer.toString() !== userId) {
        throw new Error("You are not authorized to delete this event");
      }

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
      const event = await this.model.findById(eventId);
      if (!event) throw new Error("Event not found");

      if (!isAdmin && event.organizer.toString() !== userId) {
        throw new Error("You are not authorized to update this event");
      }

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
                location: "$location",
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
