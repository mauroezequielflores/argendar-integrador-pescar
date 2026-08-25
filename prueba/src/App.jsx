import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './features/auth/pages/LoginPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<div className="p-8 text-2xl font-bold text-black">Dashboard (Mock)</div>} />
      <Route path="/recovery" element={<div className="p-8 text-black">Recuperación de contraseña (Mock)</div>} />
      <Route path="/role" element={<div className="p-8 text-black">Registro de roles (Mock)</div>} />
    </Routes>
  );
}

export default App;