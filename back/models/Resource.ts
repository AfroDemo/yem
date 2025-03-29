import mongoose, { Schema, Document } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'article' | 'video' | 'template' | 'book';
  category: string;
  content?: string;
  fileUrl?: string;
  externalUrl?: string;
  thumbnail?: string;
  author?: string;
  tags?: string[];
  visibility: 'public' | 'mentors' | 'mentees' | 'private';
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['article', 'video', 'template', 'book'], 
      required: true 
    },
    category: { type: String, required: true },
    content: { type: String },
    fileUrl: { type: String },
    externalUrl: { type: String },
    thumbnail: { type: String },
    author: { type: String },
    tags: [{ type: String }],
    visibility: { 
      type: String, 
      enum: ['public', 'mentors', 'mentees', 'private'], 
      required: true,
      default: 'public'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model<IResource>('Resource', ResourceSchema);
