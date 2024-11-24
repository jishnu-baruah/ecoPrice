import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  content: string;
  sustainabilityRating: number;
  verifiedPurchase: boolean;
  likes: number;
}

const ReviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  sustainabilityRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1, rating: -1 });
ReviewSchema.index({ productId: 1, sustainabilityRating: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);