import mongoose, { Schema, Document } from 'mongoose';

export interface IEventRegistration extends Document {
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'registered' | 'attended' | 'cancelled';
  registrationDate: Date;
  feedback?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventRegistrationSchema: Schema = new Schema(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['registered', 'attended', 'cancelled'], 
      required: true,
      default: 'registered'
    },
    registrationDate: { type: Date, default: Date.now },
    feedback: { type: String },
    rating: { type: Number }
  },
  { timestamps: true }
);

export default mongoose.model<IEventRegistration>('EventRegistration', EventRegistrationSchema);
