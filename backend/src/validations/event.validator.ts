import * as joi from "joi";

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

class EventValidator {
  public createEvent = joi.object({
    name: joi.string().required().min(3).max(200).trim(),
    description: joi.string().required().min(10).max(2000).trim(),
    category: joi
      .string()
      .required()
      .valid(
        "conference",
        "workshop",
        "seminar",
        "concert",
        "festival",
        "sports",
        "exhibition",
        "networking",
        "webinar",
        "party",
        "charity",
        "business",
        "education",
        "entertainment",
        "other"
      ),
    location: joi.string().required().min(3).max(200).trim(),
    venue: joi.string().required().min(3).max(200).trim(),
    date: joi.date().required().min(tomorrow),
    time: joi
      .string()
      .required()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    seats: joi.number().required().min(1).max(50000),
    price: joi.number().min(0).default(0),
    // eventPicture: joi.string().uri().optional(),
  });

  public updateEvent = joi.object({
    name: joi.string().min(3).max(200).trim().optional(),
    description: joi.string().min(10).max(2000).trim().optional(),
    category: joi
      .string()
      .valid(
        "conference",
        "workshop",
        "seminar",
        "concert",
        "festival",
        "sports",
        "exhibition",
        "networking",
        "webinar",
        "party",
        "charity",
        "business",
        "education",
        "entertainment",
        "other"
      )
      .optional(),
    location: joi.string().min(3).max(200).trim().optional(),
    venue: joi.string().min(3).max(200).trim().optional(),
    date: joi.date().min(tomorrow).optional(),
    time: joi
      .string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional(),
    seats: joi.number().min(1).max(50000).optional(),
    price: joi.number().min(0).optional(),
  });
}

export default new EventValidator();
