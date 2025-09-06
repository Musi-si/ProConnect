import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  role?: string;
  location?: string;
  totalEarnings?: string;
  totalSpent?: string;
  rating?: string;
  reviewCount?: number;
  isEmailVerified: boolean;
  emailVerificationToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  stripeCustomerId?: string | null;
  skills: string[];
  portfolioLinks: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  bio: { type: String },
  role: { type: String, default: "freelancer" }, // or "client"
  location: { type: String },
  totalEarnings: { type: String, default: "0" },
  totalSpent: { type: String, default: "0" },
  rating: { type: String, default: "0" },
  reviewCount: { type: Number, default: 0 },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  stripeCustomerId: { type: String, default: null },
  skills: { type: [String], default: [] },
  portfolioLinks: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = model<IUser>('User', userSchema);

export default UserModel;