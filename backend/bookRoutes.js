const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

// CRUD routes for books
router.post('/', bookController.createBook);
router.get('/', bookController.getAllBooks);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

module.exports = router;