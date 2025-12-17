import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReview extends Document {
  userName: string;
  email: string;
  userImage?: string;
  company: string;
  rating: number;
  text: string;
  videoUrl?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    userImage: { type: String },
    company: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true },
    videoUrl: { type: String },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
