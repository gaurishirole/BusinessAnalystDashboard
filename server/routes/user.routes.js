import express from 'express';
import { getUsers, updateProfile } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/profile', updateProfile);

export default router;
