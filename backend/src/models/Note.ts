import { Schema, model, Document } from "mongoose";

export interface INote extends Document {
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<INote>("Note", noteSchema);
