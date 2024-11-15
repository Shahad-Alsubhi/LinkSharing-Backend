import mongoose from "mongoose";
import { v4 as uuid } from "uuid";

export interface IUser {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  pictureURL?: string;
  links?: ILink[];
  visibleEmail?: string;
}
interface ILink {
  id: string;
  platform: string;
  url: string;
}
const linkSchema = new mongoose.Schema<ILink>({
  id: {
    type: String,
    unique:true,
    default: uuid,
  },
  platform: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});
const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  pictureURL: {
    type: String,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  links: {
    type: [linkSchema],
  },
  visibleEmail: {
    type: String,
    trim: true,
  },
});

const User = mongoose.model<IUser>("user", userSchema);
export default User;
