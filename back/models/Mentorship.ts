import mongoose, { Schema, Document } from 'mongoose';

export interface IMentorship extends Document {
  mentorId: mongoose.Types.ObjectId;
  menteeId: mongoose.Types.ObjectId;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  startDate?: Date;
  endDate?: Date;
  goals?: string[];
  progress?: {
    date: Date;
    note: string;
    achievements: string[];
  }[];
  meetingFrequency?: string;
  nextMeetingDate?: Date;
  feedback?: {
    mentorFeedback?: string;
    menteeFeedback?: string;
    mentorRating?: number;
    menteeRating?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const MentorshipSchema: Schema = new Schema(
  {
    mentorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    menteeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'active', 'completed', 'rejected'], 
      required: true,
      default: 'pending'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    goals: [{ type: String }],
    progress: [
      {
        date: { type: Date },
        note: { type: String },
        achievements: [{ type: String }]
      }
    ],
    meetingFrequency: { type: String },
    nextMeetingDate: { type: Date },
    feedback: {
      mentorFeedback: { type: String },
      menteeFeedback: { type: String },
      mentorRating: { type: Number },
      menteeRating: { type: Number }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IMentorship>('Mentorship', MentorshipSchema);
