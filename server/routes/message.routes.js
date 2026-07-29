import express from 'express';
import { 
  getMessages, 
  createMessage, 
  markAsRead, 
  updateMessageFolder 
} from '../controllers/message.controller.js';

const router = express.Router();

router.get('/', getMessages);
router.post('/', createMessage);
router.put('/:id/read', markAsRead);
router.put('/:id/folder', updateMessageFolder);

export default router;
