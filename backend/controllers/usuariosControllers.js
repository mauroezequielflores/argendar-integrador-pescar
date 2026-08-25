// backend/controllers/usuarioController.js

// 1. Importas tu cliente de Supabase (ajusta la ruta según donde tengas tu archivo de config)
import { supabase } from '../config/supabaseClient.js';

export const actualizarPerfil = async (req, res) => {
  try {
    // -------------------------------------------------------------
    // PASO 2 (Prevención de IDOR):
    // Extraemos el ID del usuario directamente del token autenticado (req.user),
    // NO de los parámetros de la URL (req.params) ni del cuerpo (req.body).
    // -------------------------------------------------------------
    const userId = req.user.id; 

    // -------------------------------------------------------------
    // PASO 3 (Prevención de Mass Assignment):
    // Filtramos solo los campos que permitimos modificar.
    // Ignoramos todo lo demás que envíe el usuario en req.body.
    // -------------------------------------------------------------
    const { nombre, telefono, direccion } = req.body; 

    // -------------------------------------------------------------
    // PASO 4 (Consulta a Supabase):
    // Actualizamos ÚNICAMENTE la fila que coincide con userId.
    // -------------------------------------------------------------
    const { data, error } = await supabase
      .from('usuarios')
      .update({ nombre, telefono, direccion })
      .eq('id', userId)
      .select();

    if (error) throw error;

    // Respondes al cliente si todo salió bien
    return res.json({ mensaje: 'Perfil actualizado con éxito', data });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};