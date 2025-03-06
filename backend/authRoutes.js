import express from 'express';
import { addNewBook, getAllBooks, getBook } from '../controllers/bookController.js';

const router = express.Router();

router.post('/', addNewBook);
router.get('/', getAllBooks);
router.get('/:id', getBook);

export default router;
