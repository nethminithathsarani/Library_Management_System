import express from 'express';
import {
  createMember,
  deleteMember,
  getAllMembers,
  updateMember,
} from '../controllers/memberController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All member endpoints require admin role
router.get('/', verifyToken, allowRoles('admin'), getAllMembers);
router.post('/', verifyToken, allowRoles('admin'), createMember);
router.put('/:id', verifyToken, allowRoles('admin'), updateMember);
router.delete('/:id', verifyToken, allowRoles('admin'), deleteMember);

export default router;
