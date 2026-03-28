/**
 * Centralized API service for all backend calls
 * Handles:
 * - Consistent error handling
 * - Auth token injection
 * - Standardized request/response
 * - Helpful error messages
 */

const API_BASE = 'http://localhost:5000/api';

/**
 * Get auth token from local storage
 */
const getAuthToken = () => localStorage.getItem('authToken') || '';

/**
 * Get auth headers (with Bearer token if available)
 */
const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch response
 * @returns {Promise<any>} Response data
 */
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

/**
 * Make API request
 * @param {string} endpoint - API endpoint (without base)
 * @param {object} options - Fetch options
 * @returns {Promise<any>} Response data
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error(`API Error: ${endpoint}`, error);
    throw error;
  }
};

// ====== BOOKS ======

export const booksAPI = {
  /**
   * Get all books
   */
  getAll: async () => {
    const response = await request('/books');
    return response.data || [];
  },

  /**
   * Create a new book
   * @param {object} bookData - Book details
   */
  create: async (bookData) => {
    const response = await request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
    return response.data;
  },

  /**
   * Update a book
   * @param {number} id - Book ID
   * @param {object} bookData - Updated book details
   */
  update: async (id, bookData) => {
    const response = await request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
    return response.data;
  },

  /**
   * Delete a book
   * @param {number} id - Book ID
   */
  delete: async (id) => {
    const response = await request(`/books/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },
};

// ====== MEMBERS ======

export const membersAPI = {
  /**
   * Get all members
   */
  getAll: async () => {
    const response = await request('/members');
    return response.data || [];
  },

  /**
   * Create a new member
   * @param {object} memberData - Member details
   */
  create: async (memberData) => {
    const response = await request('/members', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
    return response.data;
  },

  /**
   * Update a member
   * @param {number} id - Member ID
   * @param {object} memberData - Updated member details
   */
  update: async (id, memberData) => {
    const response = await request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
    return response.data;
  },

  /**
   * Delete a member
   * @param {number} id - Member ID
   */
  delete: async (id) => {
    const response = await request(`/members/${id}`, {
      method: 'DELETE',
    });
    return response.data;
  },
};

// ====== BORROWINGS ======

export const borrowingsAPI = {
  /**
   * Get all borrowings (admin only)
   */
  getAllAdmin: async () => {
    const response = await request('/borrowings/admin');
    return response.data || [];
  },

  /**
   * Get user's borrowing history
   */
  getMy: async () => {
    const response = await request('/borrowings/me');
    return response.data || [];
  },

  /**
   * Create a borrowing record
   * @param {object} borrowData - Borrowing details
   */
  create: async (borrowData) => {
    const response = await request('/borrowings', {
      method: 'POST',
      body: JSON.stringify(borrowData),
    });
    return response.data;
  },

  /**
   * Return a borrowed book
   * @param {number} borrowingId - Borrowing record ID
   */
  return: async (borrowingId) => {
    const response = await request(`/borrowings/${borrowingId}/return`, {
      method: 'PATCH',
    });
    return response.data;
  },
};

// ====== AUTHENTICATION ======

export const authAPI = {
  /**
   * Sign up a new user
   * @param {object} userData - User registration data
   */
  signup: async (userData) => {
    const response = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data;
  },

  /**
   * Log in user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: async (email, password) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.data;
  },
};

export default {
  authAPI,
  booksAPI,
  membersAPI,
  borrowingsAPI,
};
