import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatbotController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Ruta POST /api/v1/chatbot/message (Protegida con authMiddleware)
router.post('/message', authMiddleware, handleChatMessage);

export default router;
