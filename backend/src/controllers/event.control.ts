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
        seats: {
          total: data.seats,
          available: data.seats,
          booked: 0,
        },
        status: "published",
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
    searchField: string = "",
    populate: any[] = []
  ) {
    try {
      const page = parseInt(queryParams.page) || 1;
      const limit = parseInt(queryParams.limit) || 10;
      const skip = (page - 1) * limit;

      let searchCriteria = { ...filter };

      if (queryParams.search && searchField) {
        searchCriteria[searchField] = {
          $regex: queryParams.search,
          $options: "i",
        };
      }

      if (queryParams.category) {
        searchCriteria.category = queryParams.category;
      }

      if (queryParams.location) {
        searchCriteria.location = {
          $regex: queryParams.location,
          $options: "i",
        };
      }

      if (queryParams.status) {
        searchCriteria.status = queryParams.status;
      }

      if (queryParams.startDate || queryParams.endDate) {
        searchCriteria.date = {};
        if (queryParams.startDate) {
          searchCriteria.date.$gte = new Date(queryParams.startDate);
        }
        if (queryParams.endDate) {
          searchCriteria.date.$lte = new Date(queryParams.endDate);
        }
      }

      // if (!queryParams.includeAll) {
      //   searchCriteria.status = searchCriteria.status || "published";
      //   searchCriteria.isOngoing = true;
      // }

      const query = this.model
        .find(searchCriteria)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

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

      if (updateData.seats) {
        updateData.seats = {
          total: updateData.seats,
          available: updateData.seats - event.seats.booked,
          booked: event.seats.booked,
        };
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

  // async getEventsByCategory() {
  //   try {
  //     const categoryStats = await this.model.aggregate([
  //       {
  //         $match: {
  //           status: "published",
  //           isActive: true,
  //           date: { $gte: new Date() },
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: "$category",
  //           count: { $sum: 1 },
  //           events: { $push: "$$ROOT" },
  //         },
  //       },
  //       { $sort: { count: -1 } },
  //     ]);

  //     return categoryStats;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default new EventController();
