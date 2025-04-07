export const parseJsonString = (jsonString) => {
  if (!jsonString) return null;

  try {
    const parsed = JSON.parse(jsonString);
    return Array.isArray(parsed) ? parsed : null;
  } catch (e) {
    console.error("Error parsing JSON string:", e);
    return null;
  }
};

export const stringifyArray = (array) => {
  if (!array || !Array.isArray(array) || array.length === 0) return null;
  return JSON.stringify(array);
};

export const addToJsonArray = (jsonString, newItem) => {
  if (!newItem || typeof newItem !== "string") return jsonString || "[]";

  const array = parseJsonString(jsonString) || [];
  const trimmedItem = newItem.trim();

  if (trimmedItem === "") return jsonString || "[]";

  if (!array.some((item) => item.toLowerCase() === trimmedItem.toLowerCase())) {
    return JSON.stringify([...array, trimmedItem]);
  }

  return jsonString || "[]";
};

export const removeFromJsonArray = (jsonString, itemToRemove) => {
  if (!jsonString || !itemToRemove) return jsonString || "[]";

  const array = parseJsonString(jsonString) || [];
  const filteredArray = array.filter(
    (item) => item.toLowerCase() !== itemToRemove.toLowerCase()
  );

  return JSON.stringify(filteredArray);
};

export const getArrayFromJsonString = (jsonString) => {
  return parseJsonString(jsonString) || [];
};
