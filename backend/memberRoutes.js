import express from 'express';
import {
	createMember,
	deleteMember,
	getAllMembers,
	updateMember,
} from './membercontroller.js';

const router = express.Router();

router.post('/', createMember);
router.get('/', getAllMembers);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

export default router;