import { SYSTEM_INSTRUCTION } from '../utils/constants.js';
import { AppError } from '../utils/errors.js';

/**
 * Servicio para consultar la API de Gemini usando fetch nativo de Node.js.
 * No requiere librerías externas ni npm install.
 */
export const generateGeminiResponse = async ({ userMessage, userRole = 'client', userName = '', currentRoute = '' }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY no está configurada en las variables de entorno.');
    return 'Hola. En este momento el asistente con IA no está configurado correctamente en el servidor. Por favor, consulta nuestras preguntas frecuentes en la sección de Ayuda o intenta más tarde.';
  }

  const roleText = userRole === 'professional' ? 'Profesional' : 'Cliente';
  const nameText = userName ? `Nombre del usuario: ${userName}` : '';
  const routeText = currentRoute ? `Pantalla/Ruta actual en la app: ${currentRoute}` : '';

  const promptText = `[DATOS DEL USUARIO EN SESIÓN]
Rol: ${roleText}
${nameText}
${routeText}

[CONSULTA DEL USUARIO]
"${userMessage}"`;

  // Modelo configurable vía .env (ej: gemini-1.5-flash, gemini-2.5-flash, etc.)
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  // API REST oficial de Gemini (v1beta) usando fetch nativo
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('🔥 Gemini API Error response:', response.status, errorData);
      throw new AppError('Error al comunicarse con el servicio de IA de Gemini.', 502, 'GEMINI_SERVICE_ERROR');
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const generatedText = candidate?.content?.parts?.[0]?.text;

    if (!generatedText) {
      return 'Lo siento, no pude generar una respuesta clara para esa consulta. Por favor intenta reformular tu pregunta o visita la sección de Ayuda.';
    }

    return generatedText.trim();
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error('🔥 Error en geminiService:', error.message);
    throw new AppError('Ocurrió un error al procesar tu consulta con la IA.', 500, 'GEMINI_SERVICE_ERROR');
  }
};
