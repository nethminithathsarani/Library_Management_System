// Input validation helper functions
// Extracted from controllers for reuse

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password requirements
 * @param {string} password - Password to validate
 * @returns {object} { valid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: 'Password must be at least 6 characters long',
    };
  }
  return { valid: true };
};

/**
 * Validate required fields
 * @param {object} fields - Object with field names and values
 * @returns {object} { valid: boolean, missing: string[] }
 */
export const validateRequiredFields = (fields) => {
  const missing = Object.entries(fields)
    .filter(([, value]) => !value || (typeof value === 'string' && !value.trim()))
    .map(([key]) => key);

  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Validate book data
 * @param {object} bookData - Book object to validate
 * @returns {object} { valid: boolean, missing: string[] }
 */
export const validateBookData = (bookData) => {
  const required = {
    title: bookData.title,
    author: bookData.author,
    genre: bookData.genre,
    isbn: bookData.isbn,
    publicationDate: bookData.publicationDate,
  };

  return validateRequiredFields(required);
};

/**
 * Validate member data
 * @param {object} memberData - Member object to validate
 * @returns {object} { valid: boolean, missing: string[] }
 */
export const validateMemberData = (memberData) => {
  const required = {
    name: memberData.name || memberData.username,
    email: memberData.email,
  };

  return validateRequiredFields(required);
};

/**
 * Normalize boolean values (string → boolean → 0|1)
 * @param {any} value - Value to normalize
 * @returns {0|1}
 */
export const normalizeBoolean = (value) => {
  if (typeof value === 'boolean') return value ? 1 : 0;
  return Number(value) || 0;
};

/**
 * Normalize number value
 * @param {any} value - Value to normalize
 * @param {any} fallback - Fallback value if invalid
 * @returns {number} Normalized number or fallback
 */
export const normalizeNumber = (value, fallback = null) => {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

export default {
  isValidEmail,
  validatePassword,
  validateRequiredFields,
  validateBookData,
  validateMemberData,
  normalizeBoolean,
  normalizeNumber,
};
