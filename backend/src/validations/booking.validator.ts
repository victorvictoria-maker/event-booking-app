import Joi from "joi";

class BookingValidator {
  createBooking = Joi.object({
    eventId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .messages({
        "string.pattern.base": "Invalid event ID format",
        "any.required": "Event ID is required",
      }),
    // eventId: Joi.string().required(),
  });
}

export default new BookingValidator();
