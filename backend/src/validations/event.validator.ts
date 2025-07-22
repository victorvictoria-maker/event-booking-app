import * as joi from "joi";
import { CategoryI } from "../data/category.enum";

const timeRangePattern =
  /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

class EventValidator {
  public createEvent = joi.object({
    name: joi.string().required().min(3).max(200).trim(),
    description: joi.string().required().min(10).max(2000).trim(),
    category: joi
      .string()
      .required()
      .valid(...Object.values(CategoryI)),
    venue: joi.string().required().min(3).max(200).trim(),
    date: joi.date().required(),
    time: joi.string().required().pattern(timeRangePattern).messages({
      "string.pattern.base": 'Time must be in correct format "HH:MM - HH:MM"',
    }),
    totalSeats: joi.number().required().min(1).max(50000),
    price: joi.number().min(0).default(0),
    // eventPicture: joi.string().uri().optional(),
  });

  public updateEvent = joi.object({
    name: joi.string().min(3).max(200).trim().optional(),
    description: joi.string().min(10).max(2000).trim().optional(),
    category: joi
      .string()
      .valid(...Object.values(CategoryI))
      .optional(),
    venue: joi.string().min(3).max(200).trim().optional(),
    date: joi.date().optional(),
    time: joi.string().pattern(timeRangePattern).optional().messages({
      "string.pattern.base": 'Time must be in correct format "HH:MM - HH:MM"',
    }),

    totalSeats: joi.number().min(1).max(50000).optional(),
    price: joi.number().min(0).optional(),
    // eventPicture: joi.string().uri().optional(),
    status: joi.string().valid("active", "completed", "cancelled").optional(),
  });
}

export default new EventValidator();
