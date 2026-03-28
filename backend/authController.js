import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const signAuthToken = (user) => jwt.sign(
  {
    userId: user.id,
    role: user.role,
    email: user.email,
  },
  process.env.JWT_SECRET || 'change-me-in-env',
  { expiresIn: '1d' },
);

export const signup = async (req, res, next) => {
  const {
    name,
    username,
    email,
    password,
  } = req.body;

  const displayName = (name || username || '').trim();
  const normalizedRole = 'user';

  if (!displayName || !email || !password) {
    res.status(400).json({ message: 'Name/username, email, and password are required' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ message: 'Please provide a valid email address' });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters long' });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';

    db.query(sql, [displayName, email.trim().toLowerCase(), passwordHash, normalizedRole], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ message: 'Email or username is already registered' });
          return;
        }
        next(err);
        return;
      }

      res.status(201).json({
        message: 'User account created successfully',
        userId: result.insertId,
      });
    });
  } catch (error) {
    next(error);
  }
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  const sql = 'SELECT id, name, email, password_hash, role FROM users WHERE email = ? LIMIT 1';
  db.query(sql, [email.trim().toLowerCase()], async (err, results) => {
    if (err) {
      next(err);
      return;
    }

    if (!results.length) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const user = results[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid email or password' });
        return;
      }

      const normalizedUser = {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.role || 'user',
      };

      const token = signAuthToken(normalizedUser);

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: normalizedUser.id,
          username: normalizedUser.username,
          email: normalizedUser.email,
          role: normalizedUser.role,
        },
      });
    } catch (error) {
      next(error);
    }
  });
};
