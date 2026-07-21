import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import turnoRoutes from "./routes/turnoRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // <-- 1. Agrege Import de las nuevas rutas

// 1. Cargar las variables del archivo .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas de la API v1
app.use("/api/v1/turnos", turnoRoutes);
app.use('/api/v1/auth', authRoutes) // <-- 2. Agrege Registro de los endpoints de Auth

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Avisa si las variables no cargaron
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "ERROR : Falta configurar SUPABASE_URL o SUPABASE_ANON_KEY en backend/.env",
  );
}

// Definir 'supabase' a nivel global del archivo
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Endpoint base de chequeo
app.get("/", (req, res) => {
  res.json({ message: "Servidor de Argendar activo" });
});
// 2. Endpoint de ejemplo para el equipo
app.get("/api/v1/ejemplo", (req, res) => {
  res.json({
    status: "ok",
    data: {
      proyecto: "Argendar",
      mensaje: "¡Conexión exitosa entre React, Docker y Express!",
      integrantes: 9,
    },
  });
});

// Endpoint Traer la lista de usuarios de la aplicación
app.get("/api/v1/usuarios", async (req, res) => {
  try {
    // Aquí es donde Node.js necesita que 'supabase' esté definido arriba
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, apellido, email, created_at")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      status: "success",
      data: data,
    });
  } catch (error) {
    // Si falla, capturamos el error real de Supabase
    console.error(
      "Error al consultar la tabla usuarios:",
      error.message || error,
    );
    res.status(500).json({
      status: "error",
      message: "Error al conectar con la tabla de usuarios.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
