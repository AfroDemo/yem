import api from '../utils/api';

// Create event
export const createEvent = async (eventData: {
  title: string;
  description: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  location: string;
  isOnline: boolean;
  maxAttendees?: number;
  tags?: string[];
  category: string;
}) => {
  try {
    const response = await api.post('/events', eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create event';
  }
};

// Get all events
export const getAllEvents = async (filters?: {
  type?: string;
  category?: string;
  upcoming?: boolean;
  past?: boolean;
}) => {
  try {
    let url = '/events';
    if (filters) {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.upcoming) queryParams.append('upcoming', 'true');
      if (filters.past) queryParams.append('past', 'true');
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get events';
  }
};

// Get event by ID
export const getEventById = async (eventId: string) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get event';
  }
};

// Update event
export const updateEvent = async (eventId: string, eventData: {
  title?: string;
  description?: string;
  type?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  isOnline?: boolean;
  maxAttendees?: number;
  tags?: string[];
  category?: string;
}) => {
  try {
    const response = await api.put(`/events/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update event';
  }
};

// Delete event
export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete event';
  }
};

// Get upcoming events
export const getUpcomingEvents = async () => {
  try {
    const response = await api.get('/events/upcoming');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get upcoming events';
  }
};

// Search events
export const searchEvents = async (query: string) => {
  try {
    const response = await api.get(`/events/search?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to search events';
  }
};

// Register for event
export const registerForEvent = async (eventId: string) => {
  try {
    const response = await api.post('/event-registrations', { eventId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to register for event';
  }
};

// Get registrations by event
export const getRegistrationsByEvent = async (eventId: string) => {
  try {
    const response = await api.get(`/event-registrations/event/${eventId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get event registrations';
  }
};

// Get registrations by user
export const getRegistrationsByUser = async (userId: string) => {
  try {
    const response = await api.get(`/event-registrations/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get user registrations';
  }
};

// Cancel registration
export const cancelRegistration = async (registrationId: string) => {
  try {
    const response = await api.put(`/event-registrations/${registrationId}/cancel`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to cancel registration';
  }
};

// Update registration status (for organizers)
export const updateRegistrationStatus = async (registrationId: string, status: 'confirmed' | 'cancelled' | 'attended' | 'no-show') => {
  try {
    const response = await api.put(`/event-registrations/${registrationId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update registration status';
  }
};
