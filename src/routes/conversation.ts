import { Router } from 'express';
import { ConversationController } from '../controllers/ConversationController.js';

const router = Router();
const conversationController = new ConversationController();

router.post('/', conversationController.createConversation);

export default router;