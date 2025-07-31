// src/utils/dateHelpers.js

/**
 * Checks if a given ISO date string falls on the current day.
 * @param {string} isoDateString - The date string in ISO format (e.g., from your database's TIMESTAMP column).
 * @returns {boolean} True if the date is today, false otherwise.
 */
export const isToday = (isoDateString) => {
  const today = new Date();
  const date = new Date(isoDateString); 
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

/**
 * Checks if a given ISO date string falls within the current week (Sunday to Saturday).
 * @param {string} isoDateString - The date string in ISO format.
 * @returns {boolean} True if the date is within the current week, false otherwise.
 */
export const isThisWeek = (isoDateString) => {
  const today = new Date();
  const date = new Date(isoDateString);

  // Get the start of the current week (Sunday)
  // today.getDay() returns 0 for Sunday, 1 for Monday, etc.
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0); // Set to beginning of the day

  // Get the end of the current week (Saturday)
  const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
  endOfWeek.setHours(23, 59, 59, 999); // Set to end of the day

  return date >= startOfWeek && date <= endOfWeek;
};