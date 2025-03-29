import mongoose from 'mongoose';
import User from './User';
import MentorProfile from './MentorProfile';
import MenteeProfile from './MenteeProfile';
import Mentorship from './Mentorship';
import Resource from './Resource';
import Event from './Event';
import EventRegistration from './EventRegistration';
import Message from './Message';
import Conversation from './Conversation';
import SuccessStory from './SuccessStory';

// Export all models
export {
  User,
  MentorProfile,
  MenteeProfile,
  Mentorship,
  Resource,
  Event,
  EventRegistration,
  Message,
  Conversation,
  SuccessStory
};

// Create index file for easier imports
export default {
  User,
  MentorProfile,
  MenteeProfile,
  Mentorship,
  Resource,
  Event,
  EventRegistration,
  Message,
  Conversation,
  SuccessStory
};
