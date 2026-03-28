import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { sendSuccess, sendError, sendServerError } from '../utils/responseHandler.js';
import { isValidEmail, validatePassword } from '../utils/validation.js';

/**
 * Sign JWT token with user claims
 * @private
 */
const signAuthToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET || 'change-me-in-env',
    { expiresIn: '1d' }
  );
};

/**
 * User signup - Create new account
 */
export const signup = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    const displayName = (name || username || '').trim();
    const normalizedEmail = (email || '').trim().toLowerCase();

    // Validate inputs
    if (!displayName || !normalizedEmail || !password) {
      sendError(res, 400, 'Name/username, email, and password are required');
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      sendError(res, 400, 'Please provide a valid email address');
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      sendError(res, 400, passwordValidation.message);
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [displayName, normalizedEmail, passwordHash, 'user'], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          sendError(res, 409, 'Email is already registered');
          return;
        }
        sendServerError(res, err, 'Failed to create user account');
        return;
      }

      sendSuccess(res, 201, 'User account created successfully', {
        userId: result.insertId,
      });
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to create user account');
  }
};

/**
 * User login - Authenticate and return JWT
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 400, 'Email and password are required');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const sql = 'SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1';
    db.query(sql, [normalizedEmail], async (err, results) => {
      if (err) {
        sendServerError(res, err, 'Failed to authenticate user');
        return;
      }

      if (!results.length) {
        sendError(res, 401, 'Invalid email or password');
        return;
      }

      const user = results[0];

      try {
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          sendError(res, 401, 'Invalid email or password');
          return;
        }

        // Sign token
        const token = signAuthToken({
          id: user.id,
          role: user.role || 'user',
          email: user.email,
        });

        sendSuccess(res, 200, 'Login successful', {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
          },
        });
      } catch (error) {
        sendServerError(res, error, 'Failed to authenticate user');
      }
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to authenticate user');
  }
};
