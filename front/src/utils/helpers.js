export function safeJSONParse(jsonString, defaultValue = []) {
  if (!jsonString || jsonString.trim() === '') return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn('Failed to parse JSON:', jsonString, error);
    return defaultValue;
  }
}