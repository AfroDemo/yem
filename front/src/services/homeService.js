// services/homeService.js
import { get } from "../utils/api";

export const getHomePageData = async () => {
  try {
    const response = await get("/home");
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch homepage data: " + error.message);
  }
};