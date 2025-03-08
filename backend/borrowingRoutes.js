const express = require('express');
const borrowingController = require('../controllers/borrowingController');

const router = express.Router();

// Borrowing routes
router.post('/', borrowingController.borrowBook);
router.delete('/:borrowingId', borrowingController.returnBook);
router.get('/', borrowingController.getAllBorrowings);

module.exports = router;