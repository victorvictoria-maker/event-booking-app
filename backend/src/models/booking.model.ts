import { Document, Schema, model, Model } from "mongoose";

export interface IBooking extends Document {
  user: Schema.Types.ObjectId;
  event: Schema.Types.ObjectId;
  totalAmount: number;
  paymentStatus: "paid" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "event",
      required: [true, "Event is required"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "failed"],
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

schema.index({ user: 1, event: 1 }, { unique: true });
schema.index({ user: 1 });
schema.index({ event: 1 });
schema.index({ paymentStatus: 1 });
schema.index({ createdAt: -1 });

export interface IBookingModel extends Model<IBooking> {}

const BookingModel: IBookingModel = model<IBooking, IBookingModel>(
  "booking",
  schema
);
export default BookingModel;
