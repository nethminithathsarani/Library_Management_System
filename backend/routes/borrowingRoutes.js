import express from 'express';
import {
  borrowBook,
  getAllBorrowingsForAdmin,
  getMyBorrowings,
  returnBook,
} from '../controllers/borrowingController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// User endpoint - own borrowing history
router.get('/me', verifyToken, allowRoles('user'), getMyBorrowings);

// Admin endpoints
router.get('/admin', verifyToken, allowRoles('admin'), getAllBorrowingsForAdmin);
router.post('/', verifyToken, allowRoles('admin'), borrowBook);
router.patch('/:borrowingId/return', verifyToken, allowRoles('admin'), returnBook);

export default router;
