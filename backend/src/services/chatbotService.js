import { supabase } from '../config/supabase.js';
import { generateGeminiResponse } from './geminiService.js';

/**
 * Servicio orquestador del chatbot de Argendar.
 */
export const processChatbotMessage = async ({ userId, role, message, currentRoute }) => {
  let userName = '';

  // Si el usuario está autenticado, obtenemos su nombre para personalizar la interacción
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (profile) {
      userName = profile.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : '';
    }
  }

  // Generar respuesta con Gemini de forma contextualizada
  const responseText = await generateGeminiResponse({
    userMessage: message,
    userRole: role || 'client',
    userName,
    currentRoute: currentRoute || ''
  });

  return {
    message: responseText,
    timestamp: new Date().toISOString()
  };
};
