import { Document, Schema, model, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [5, "Password must have 5 characters"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// schema.index({ email: 1 });
// schema.index({ username: 1 });

export interface IUserModel extends Model<IUser> {}

const UserModel: IUserModel = model<IUser, IUserModel>("user", schema);
export default UserModel;
