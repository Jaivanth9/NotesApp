import mongoose, { Document, Schema } from "mongoose";

export interface IOtpToken extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  createdAt: Date;
}

const OtpTokenSchema = new Schema<IOtpToken>(
  {
    email: { type: String, required: true, index: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  { timestamps: true }
);

// Ensure documents auto-delete after expiresAt (Mongo TTL index)
OtpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);
