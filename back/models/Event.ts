import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  type: 'workshop' | 'networking' | 'webinar' | 'conference';
  startDate: Date;
  endDate: Date;
  location: {
    online: boolean;
    platform?: string;
    meetingLink?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  host?: mongoose.Types.ObjectId;
  speakers?: {
    name: string;
    bio?: string;
    image?: string;
  }[];
  maxAttendees?: number;
  currentAttendees: number;
  registrationDeadline?: Date;
  thumbnail?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['workshop', 'networking', 'webinar', 'conference'], 
      required: true 
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: {
      online: { type: Boolean, default: false },
      platform: { type: String },
      meetingLink: { type: String },
      address: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String }
    },
    host: { type: Schema.Types.ObjectId, ref: 'User' },
    speakers: [
      {
        name: { type: String },
        bio: { type: String },
        image: { type: String }
      }
    ],
    maxAttendees: { type: Number },
    currentAttendees: { type: Number, default: 0 },
    registrationDeadline: { type: Date },
    thumbnail: { type: String },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model<IEvent>('Event', EventSchema);
