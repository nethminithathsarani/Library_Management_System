import express from 'express';
import {
  createBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from './bookController.js';
import { verifyToken } from './middleware/authMiddleware.js';
import { allowRoles } from './middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', getAllBooks);
router.post('/', verifyToken, allowRoles('admin'), createBook);
router.put('/:id', verifyToken, allowRoles('admin'), updateBook);
router.delete('/:id', verifyToken, allowRoles('admin'), deleteBook);

export default router;
