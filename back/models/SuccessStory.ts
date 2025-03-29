import mongoose, { Schema, Document } from 'mongoose';

export interface ISuccessStory extends Document {
  title: string;
  content: string;
  menteeId?: mongoose.Types.ObjectId;
  mentorId?: mongoose.Types.ObjectId;
  businessName?: string;
  businessDescription?: string;
  achievements?: string[];
  images?: string[];
  featured: boolean;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: 'User' },
    mentorId: { type: Schema.Types.ObjectId, ref: 'User' },
    businessName: { type: String },
    businessDescription: { type: String },
    achievements: [{ type: String }],
    images: [{ type: String }],
    featured: { type: Boolean, default: false },
    approved: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
