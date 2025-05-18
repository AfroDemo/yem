import { get, post, put, del } from "../utils/api";

export const createResource = async (resourceData) => {
  const formData = new FormData();
  formData.append("createdById", resourceData.createdById);
  formData.append("title", resourceData.title);
  formData.append("description", resourceData.description || "");
  formData.append("type", resourceData.type);
  formData.append("category", resourceData.category);
  formData.append("tags", JSON.stringify(resourceData.tags));
  formData.append("isDraft", resourceData.isDraft);
  formData.append("isFeatured", resourceData.isFeatured);
  formData.append("sharedWithIds", JSON.stringify(resourceData.sharedWithIds));

  if (resourceData.file) {
    formData.append("file", resourceData.file);
  }
  if (resourceData.fileUrl) {
    formData.append("fileUrl", resourceData.fileUrl);
  }

  try {
    const response = await post("/resources", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Create resource error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to create resource"
    );
  }
};

export const getMentees = async (mentorId) => {
  try {
    const response = await get(`/mentors/${mentorId}/mentees`);
    return response.data;
  } catch (error) {
    console.error("Get mentees error:", error.response || error);
    throw new Error(error.response?.data?.message || "Failed to fetch mentees");
  }
};

export const getResources = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await get(
      `/resources${queryString ? `?${queryString}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Get resources error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch resources"
    );
  }
};

export const getResourceById = async (id) => {
  try {
    const response = await get(`/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error("Get resource by ID error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch resource"
    );
  }
};

export const updateResource = async (id, resourceData) => {
  const formData = new FormData();
  Object.entries(resourceData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      // Send tags and sharedWithIds as arrays (not JSON) for updateResource
      if (key === "tags" || key === "sharedWithIds") {
        value.forEach((item, index) =>
          formData.append(`${key}[${index}]`, item)
        );
      } else {
        formData.append(key, value);
      }
    }
  });

  try {
    const response = await put(`/resources/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Update resource error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to update resource"
    );
  }
};

export const deleteResource = async (id) => {
  try {
    const response = await del(`/resources/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete resource error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to delete resource"
    );
  }
};

export const getFeaturedResources = async () => {
  try {
    const response = await get("/resources/featured");
    return response.data;
  } catch (error) {
    console.error("Get featured resources error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch featured resources"
    );
  }
};

export const searchResources = async (query) => {
  try {
    const response = await get(
      `/resources/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  } catch (error) {
    console.error("Search resources error:", error.response || error);
    throw new Error(
      error.response?.data?.message || "Failed to search resources"
    );
  }
};
