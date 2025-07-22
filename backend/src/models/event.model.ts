import { Document, Schema, model, Model } from "mongoose";

export interface IEvent extends Document {
  name: string;
  description: string;
  category: string;
  venue: string;
  date: Date;
  time: string;
  totalSeats: number;
  price: number;
  isFree: boolean;
  eventPicture?: string;
  organizer: Schema.Types.ObjectId;
  status: "active" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, "Event name is required"],
      unique: true,
      trim: true,
      maxlength: [200, "Event name cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: [
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
        "other",
      ],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: function (value: Date) {
          return value > new Date();
        },
        message: "Event date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      match: [
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Time must be in format 'HH:MM - HH:MM'",
      ],
    },
    totalSeats: {
      type: Number,
      required: [true, "Total seats is required"],
      min: [1, "Total seats must be at least 1"],
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "Price cannot be negative"],
    },
    isFree: {
      type: Boolean,
      default: function (this: IEvent) {
        return this.price === 0;
      },
    },
    eventPicture: {
      type: String,
      trim: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Event organizer is required"],
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

schema.pre("save", function (this: IEvent) {
  this.isFree = this.price === 0;
});

schema.index({ category: 1 });
schema.index({ date: 1 });
schema.index({ status: 1 });
schema.index({ organizer: 1 });
schema.index({ totalSeats: 1 });
schema.index({ status: 1, date: 1, category: 1 });
schema.index({ name: "text", description: "text" });

export interface IEventModel extends Model<IEvent> {}

const EventModel: IEventModel = model<IEvent, IEventModel>("event", schema);
export default EventModel;
