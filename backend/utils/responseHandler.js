// Standardized API response handler
// Ensures consistent response format across all endpoints

/**
 * Send a success response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {any} data - Response data (optional)
 */
export const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {any} details - Error details (optional)
 */
export const sendError = (res, statusCode, message, details = null) => {
  const response = {
    success: false,
    message,
  };
  
  if (details !== null) {
    response.details = details;
  }
  
  res.status(statusCode).json(response);
};

/**
 * Handle unexpected server errors
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} context - Context describing where error occurred
 */
export const sendServerError = (res, error, context = 'Internal server error') => {
  console.error(`[${context}]`, error);
  sendError(res, 500, context);
};

// Export as default object for convenience
export default {
  sendSuccess,
  sendError,
  sendServerError,
};
