import { Schema, model, Document } from 'mongoose';

interface Review extends Document {
  reviewerId: string;
  revieweeId: string;
  projectId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<Review>({
  reviewerId: { type: String, required: true },
  revieweeId: { type: String, required: true },
  projectId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReviewModel = model<Review>('Review', reviewSchema);

export default ReviewModel;