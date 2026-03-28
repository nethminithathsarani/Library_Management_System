import express from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from '../controllers/bookController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public endpoint
router.get('/', getAllBooks);

// Admin-only endpoints
router.post('/', verifyToken, allowRoles('admin'), createBook);
router.put('/:id', verifyToken, allowRoles('admin'), updateBook);
router.delete('/:id', verifyToken, allowRoles('admin'), deleteBook);

export default router;
