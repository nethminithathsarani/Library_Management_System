import express from 'express';
import {
	borrowBook,
	getAllBorrowings,
	returnBook,
} from './borrowingController.js';

const router = express.Router();

router.post('/', borrowBook);
router.delete('/:borrowingId', returnBook);
router.get('/', getAllBorrowings);

export default router;