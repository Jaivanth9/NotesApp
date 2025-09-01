import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  password?: string; // absent for Google users
  name?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String }, // hashed
    name: { type: String },
    googleId: { type: String, index: true, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
