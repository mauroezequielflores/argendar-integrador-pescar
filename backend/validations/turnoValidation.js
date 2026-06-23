/**
 * Validador para asegurar que el usuarioId en params es un UUID válido.
 */
export const validarUsuarioId = (req, res, next) => {
  const { usuarioId } = req.params;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  
  if (!usuarioId || !uuidRegex.test(usuarioId)) {
    return res.status(400).json({
      status: "error",
      message: "El parámetro usuarioId proporcionado no es un UUID válido."
    });
  }
  
  next();
};
