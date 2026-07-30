// backend/middlewares/authMiddleware.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
);

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  // Validación real con Supabase Auth
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  // Inyectamos el usuario real autenticado
  req.user = {
    id: user.id,
    email: user.email,
    role: user.app_metadata?.role || "cliente", // Leído de metadatos protegidos
  };

  next();
};
