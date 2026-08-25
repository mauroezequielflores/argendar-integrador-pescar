import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validations/login.schema';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data) => {
    // Simulamos petición al back
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: 1,
      name: "Usuario Demo",
      email: data.email,
      role: "profesional"
    };
    login(mockUser);
    navigate('/dashboard'); // Ajustar ruta según rol en el futuro
  };

  const handleGoogleLogin = () => {
    console.log("login con google");
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#202020] p-8 lg:p-12 rounded-[20px] shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-[#FFFFFF] text-3xl font-bold mb-2">Iniciar sesión.</h1>
        <p className="text-[#A8A8AA] text-sm">Ingresá tus credenciales para acceder a tu cuenta.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Input
          label="Correo electrónico"
          placeholder="P.Ej: ejemplo01@gmail.com"
          type="email"
          error={errors.email}
          {...register('email')}
        />

        <div className="relative">
          <Link to="/recovery" className="absolute right-0 -top-6 text-[#F78736] hover:text-white text-xs font-medium transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
          <Input
            label="Contraseña"
            placeholder="P.Ej: ejEmplo123"
            type="password"
            error={errors.password}
            {...register('password')}
          />
        </div>

        <div className="mt-1">
          <Checkbox label="Recordarme" {...register('rememberMe')} />
        </div>

        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          Iniciar sesión
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-[#333333]"></div>
        <span className="text-[#A8A8AA] text-xs">O</span>
        <div className="flex-1 h-px bg-[#333333]"></div>
      </div>

      <Button variant="outline" onClick={handleGoogleLogin} type="button">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5 mr-3" />
        Continuar con Google
      </Button>

      <div className="text-center mt-8">
        <span className="text-[#A8A8AA] text-sm">¿No tenés una cuenta? </span>
        <Link to="/role" className="text-[#F78736] hover:text-white text-sm font-medium transition-colors">
          Registrarme
        </Link>
      </div>
    </div>
  );
};
