import api from '../utils/api';

// Create resource
export const createResource = async (resourceData: {
  title: string;
  description: string;
  type: string;
  content?: string;
  tags?: string[];
  category: string;
  fileUrl?: string;
}) => {
  try {
    const response = await api.post('/resources', resourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create resource';
  }
};

// Get all resources
export const getAllResources = async (filters?: {
  type?: string;
  category?: string;
  tag?: string;
}) => {
  try {
    let url = '/resources';
    if (filters) {
      const queryParams = new URLSearchParams();
      if (filters.type) queryParams.append('type', filters.type);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.tag) queryParams.append('tag', filters.tag);
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
    }
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get resources';
  }
};

// Get resource by ID
export const getResourceById = async (resourceId: string) => {
  try {
    const response = await api.get(`/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get resource';
  }
};

// Update resource
export const updateResource = async (resourceId: string, resourceData: {
  title?: string;
  description?: string;
  content?: string;
  tags?: string[];
  category?: string;
  fileUrl?: string;
}) => {
  try {
    const response = await api.put(`/resources/${resourceId}`, resourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update resource';
  }
};

// Delete resource
export const deleteResource = async (resourceId: string) => {
  try {
    const response = await api.delete(`/resources/${resourceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete resource';
  }
};

// Get featured resources
export const getFeaturedResources = async () => {
  try {
    const response = await api.get('/resources/featured');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to get featured resources';
  }
};

// Search resources
export const searchResources = async (query: string) => {
  try {
    const response = await api.get(`/resources/search?query=${query}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to search resources';
  }
};
