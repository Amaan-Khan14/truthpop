import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  messages: Message[];
  verifyCode: string;
  isVerified: boolean;
  verifyCodeExpires: Date;
  isAcceptingMessages: boolean;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  messages: [MessageSchema],
  verifyCode: {
    type: String,
    required: [true, "Code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCodeExpires: {
    type: Date,
    required: [true, "Expiry is required"],
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
});

export const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
