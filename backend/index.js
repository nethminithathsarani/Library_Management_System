import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bookRoutes from './routes/bookRoutes.js';
import memberRoutes from './routes/memberRoutes.js';
import borrowingRoutes from './routes/borrowingRoutes.js';
import authRoutes from './routes/authRoutes.js';
import './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Library Management System Backend');
});

// API routes
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/borrowings', borrowingRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error('API error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});