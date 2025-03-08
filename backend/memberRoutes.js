const express = require('express');
const memberController = require('../controllers/memberController');

const router = express.Router();

// CRUD routes for members
router.post('/', memberController.createMember);
router.get('/', memberController.getAllMembers);
router.put('/:id', memberController.updateMember);
router.delete('/:id', memberController.deleteMember);

module.exports = router;