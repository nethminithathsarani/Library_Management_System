import express from 'express';
import {
  createMember,
  deleteMember,
  getAllMembers,
  updateMember,
} from './membercontroller.js';
import { verifyToken } from './middleware/authMiddleware.js';
import { allowRoles } from './middleware/roleMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, allowRoles('admin'), createMember);
router.get('/', verifyToken, allowRoles('admin'), getAllMembers);
router.put('/:id', verifyToken, allowRoles('admin'), updateMember);
router.delete('/:id', verifyToken, allowRoles('admin'), deleteMember);

export default router;
