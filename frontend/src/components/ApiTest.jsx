import { useState, useEffect } from 'react';

export default function ApiTest() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/v1/usuarios`);
        
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        
        const json = await response.json();
        setUsuarios(json.data);
      } catch (err) {
        console.error("Error al traer usuarios:", err);
        setError("No se pudo conectar con el listado de usuarios.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <p className="text-center text-gray-500 animate-pulse">Cargando comunidad Argendar...</p>;
  if (error) return <p className="text-center text-red-500 font-semibold">⚠️ {error}</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-between">
        <span>👥 Usuarios Registrados</span>
        <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
          {usuarios.length} Total
        </span>
      </h2>
      
      <div className="space-y-4">
        {usuarios.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No hay usuarios en la base de datos.</p>
        ) : (
          usuarios.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:shadow-sm"
            >
              {/* Avatar generado con iniciales */}
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
                {user.nombre[0]?.toUpperCase()}{user.apellido[0]?.toUpperCase()}
              </div>
              
              {/* Información del usuario */}
              <div className="overflow-hidden">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {user.nombre} {user.apellido}
                </h3>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}