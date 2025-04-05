export const csvToArray = (str) =>
  str
    ? str
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item)
    : [];

export const arrayToCsv = (arr) => arr.join(", ");

export const addToCsv = (currentCsv, newItem) => {
  const array = csvToArray(currentCsv);
  const trimmedItem = newItem.trim();
  if (!array.includes(trimmedItem)) {
    return arrayToCsv([...array, trimmedItem]);
  }
  return currentCsv;
};

export const removeFromCsv = (currentCsv, itemToRemove) => {
  const array = csvToArray(currentCsv);
  return arrayToCsv(array.filter((item) => item !== itemToRemove));
};
