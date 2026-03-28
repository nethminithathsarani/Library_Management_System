// Date handling utilities
// Extracted from controllers for consistency

/**
 * Format date to YYYY-MM-DD string
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export const formatDateOnly = (date) => {
  if (!date || !(date instanceof Date)) {
    date = new Date();
  }
  return date.toISOString().slice(0, 10);
};

/**
 * Parse date string and validate
 * @param {string} dateString - Date string to parse
 * @param {string} fieldName - Field name for error messages
 * @returns {object} { valid: boolean, date: Date, message: string }
 */
export const parseAndValidateDate = (dateString, fieldName = 'Date') => {
  const date = new Date(dateString);
  
  if (Number.isNaN(date.getTime())) {
    return {
      valid: false,
      message: `Invalid ${fieldName} format. Use YYYY-MM-DD.`,
    };
  }
  
  return {
    valid: true,
    date,
  };
};

/**
 * Calculate due date from borrow date (default 14 days)
 * @param {Date} borrowDate - Borrow date
 * @param {number} days - Number of days (default 14)
 * @returns {string} Due date in YYYY-MM-DD format
 */
export const calculateDueDate = (borrowDate, days = 14) => {
  const dueDate = new Date(borrowDate);
  dueDate.setDate(dueDate.getDate() + days);
  return formatDateOnly(dueDate);
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string}
 */
export const getTodayDate = () => {
  return formatDateOnly(new Date());
};

/**
 * Check if date is in the past
 * @param {Date} date - Date to check
 * @returns {boolean}
 */
export const isDateInPast = (date) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
};

export default {
  formatDateOnly,
  parseAndValidateDate,
  calculateDueDate,
  getTodayDate,
  isDateInPast,
};
