/* Lógica de negocio para ABMD de usuarios y gestión de perfil/servicios del profesional. */

import { getAllUsuariosModel, updateUsuarioModel } from '../models/usuarioModel.js';

// Listar todos los usuarios (Dashboard Admin)
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getAllUsuariosModel();
    return res.status(200).json({ status: "success", results: usuarios.length, data: { usuarios } });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error al listar usuarios", details: error.message });
  }
};

// Actualizar perfil de usuario o rol
export const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const datos = req.body;

  try {
    const usuarioActualizado = await updateUsuarioModel(id, datos);
    return res.status(200).json({
      status: "success",
      message: "Usuario actualizado correctamente",
      data: { usuario: usuarioActualizado }
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error al actualizar usuario", details: error.message });
  }
};