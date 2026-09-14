import { supabase } from '../config/supabase.js';
import { AppError } from './errors.js';

/**
 * Sube una imagen en base64 a Supabase Storage y devuelve la URL pública.
 * @param {string} base64String Cadena base64 (ej: data:image/png;base64,iVBORw0KGgo...)
 * @param {string} bucketName Nombre del bucket en Supabase
 * @param {string} fileName Nombre del archivo de destino
 * @returns {Promise<string>} URL pública de la imagen
 */
export const uploadBase64Image = async (base64String, bucketName, fileName) => {
  if (!base64String.startsWith('data:image')) {
    // Si no es base64, asumimos que ya es una URL válida o string vacío
    return base64String;
  }

  try {
    // Extraer mime type y data pura
    const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      throw new Error('Formato base64 inválido');
    }
    
    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Extensión del archivo
    const ext = mimeType.split('/')[1] || 'png';
    const finalName = `${fileName}-${Date.now()}.${ext}`;

    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(finalName, buffer, {
        contentType: mimeType,
        upsert: true
      });

    if (error) {
      console.error("Storage upload error:", error);
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(data.path);
    return publicUrlData.publicUrl;
  } catch (error) {
    throw new AppError(`Error al subir imagen: ${error.message}`, 500);
  }
};
