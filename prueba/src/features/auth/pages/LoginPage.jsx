import { LoginForm } from '../components/LoginForm';
import { AuthCarousel } from '../components/AuthCarousel';
import { useAuth } from '../../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex bg-[#292929] lg:bg-[#202020]">
      {/* Columna Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
        <LoginForm />
      </div>

      {/* Columna Derecha: Carrusel (oculto en mobile) */}
      <div className="hidden lg:block lg:w-1/2">
        <AuthCarousel />
      </div>
    </div>
  );
};
