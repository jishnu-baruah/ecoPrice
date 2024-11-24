import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ProductCategory } from './Product';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  profile: {
    avatar?: string;
    preferences: {
      preferredCategories: ProductCategory[];
      sustainabilityPriorities: string[];
      priceAlerts: boolean;
    };
  };
  savedProducts: mongoose.Types.ObjectId[];
  searchHistory: {
    query: string;
    timestamp: Date;
  }[];
  carbonSavings: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  profile: {
    avatar: String,
    preferences: {
      preferredCategories: [{
        type: String,
        enum: Object.values(ProductCategory)
      }],
      sustainabilityPriorities: [String],
      priceAlerts: {
        type: Boolean,
        default: false
      }
    }
  },
  savedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
  searchHistory: [{
    query: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  carbonSavings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);