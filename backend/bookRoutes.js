import express from 'express';
import {
	createBook,
	deleteBook,
	getAllBooks,
	updateBook,
} from './bookController.js';

const router = express.Router();

router.post('/', createBook);
router.get('/', getAllBooks);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

export default router;