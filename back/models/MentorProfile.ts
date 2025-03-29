import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  expertise: string[];
  experience: number;
  company?: string;
  position?: string;
  availability?: {
    hoursPerWeek?: number;
    preferredDays?: string[];
    preferredTimes?: string[];
  };
  mentorshipStyle?: string;
  acceptingMentees: boolean;
  maxMentees: number;
  currentMenteeCount: number;
  rating?: number;
  reviewCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MentorProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expertise: [{ type: String, required: true }],
    experience: { type: Number, required: true },
    company: { type: String },
    position: { type: String },
    availability: {
      hoursPerWeek: { type: Number },
      preferredDays: [{ type: String }],
      preferredTimes: [{ type: String }],
    },
    mentorshipStyle: { type: String },
    acceptingMentees: { type: Boolean, default: true },
    maxMentees: { type: Number, default: 3 },
    currentMenteeCount: { type: Number, default: 0 },
    rating: { type: Number },
    reviewCount: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<IMentorProfile>('MentorProfile', MentorProfileSchema);
