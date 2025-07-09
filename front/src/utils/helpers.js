// utils/helpers.js
export const safeJSONParse = (value, defaultValue = []) => {
  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : defaultValue;
    }
    return Array.isArray(value) ? value : defaultValue;
  } catch (error) {
    console.error("Error parsing JSON:", error, value);
    return defaultValue;
  }
};
