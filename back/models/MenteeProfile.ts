import mongoose, { Schema, Document } from 'mongoose';

export interface IMenteeProfile extends Document {
  userId: mongoose.Types.ObjectId;
  entrepreneurshipStage: 'idea' | 'startup' | 'growth';
  businessIdea?: string;
  goals?: string[];
  challenges?: string[];
  preferredMentorExpertise?: string[];
  educationBackground?: string;
  workExperience?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MenteeProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entrepreneurshipStage: { 
      type: String, 
      enum: ['idea', 'startup', 'growth'], 
      required: true 
    },
    businessIdea: { type: String },
    goals: [{ type: String }],
    challenges: [{ type: String }],
    preferredMentorExpertise: [{ type: String }],
    educationBackground: { type: String },
    workExperience: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IMenteeProfile>('MenteeProfile', MenteeProfileSchema);
