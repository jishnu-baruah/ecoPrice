import mongoose, { Schema, Document } from 'mongoose';

export interface IComment {
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
}

export interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  likes: mongoose.Types.ObjectId[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 5000
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema]
}, {
  timestamps: true
});

// Indexes for better query performance
PostSchema.index({ userId: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>('Post', PostSchema);