import { ValidationError } from '../utils/errors.js';
import { processChatbotMessage } from '../services/chatbotService.js';

/**
 * Controlador del chatbot.
 */
export const handleChatMessage = async (req, res, next) => {
  try {
    const { message, currentRoute } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new ValidationError('El mensaje no puede estar vacío.');
    }

    if (message.length > 500) {
      throw new ValidationError('El mensaje es demasiado largo (máximo 500 caracteres).');
    }

    // req.user proviene del authMiddleware
    const userId = req.user?.id || null;
    const role = req.user?.role || 'client';

    const result = await processChatbotMessage({
      userId,
      role,
      message: message.trim(),
      currentRoute: currentRoute || ''
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
