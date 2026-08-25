import { jest } from '@jest/globals';
import { AuthService } from '../services/auth.service.js';
import { supabase, supabaseAdmin } from '../config/supabase.js';

describe('AuthService (Servicios EP-AUTH)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register (HU-01 y HU-02)', () => {
    test('debe registrar exitosamente a un cliente', async () => {
      const mockUserId = '11111111-1111-1111-1111-111111111111';
      jest.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: {
          user: { id: mockUserId, email: 'cliente@argendar.com', identities: [{}] },
          session: { access_token: 'jwt-token-abc', refresh_token: 'refresh-xyz', expires_in: 3600, token_type: 'bearer' }
        },
        error: null
      });

      jest.spyOn(supabaseAdmin, 'from').mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            upsert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: mockUserId, rol: 'client', nombre: 'Juan', apellido: 'Pérez', esta_suspendido: false },
              error: null
            })
          };
        }
      });

      const resultado = await AuthService.register({
        email: 'cliente@argendar.com',
        password: 'Password123',
        first_name: 'Juan',
        last_name: 'Pérez',
        role: 'client'
      });

      expect(resultado.user.id).toBe(mockUserId);
      expect(resultado.user.role).toBe('client');
      expect(resultado.session.access_token).toBe('jwt-token-abc');
    });

    test('debe registrar exitosamente a un profesional y crear professional_profiles con onboarding_completo = false', async () => {
      const mockUserId = '22222222-2222-2222-2222-222222222222';
      jest.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: {
          user: { id: mockUserId, email: 'pro@argendar.com', identities: [{}] },
          session: { access_token: 'jwt-pro-token', refresh_token: 'ref', expires_in: 3600, token_type: 'bearer' }
        },
        error: null
      });

      const upsertProfMock = jest.fn().mockResolvedValue({ data: {}, error: null });

      jest.spyOn(supabaseAdmin, 'from').mockImplementation((table) => {
        if (table === 'profiles') {
          return {
            upsert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({
              data: { id: mockUserId, rol: 'professional', nombre: 'Mario', apellido: 'Gómez', esta_suspendido: false },
              error: null
            })
          };
        }
        if (table === 'professional_profiles') {
          return {
            upsert: upsertProfMock
          };
        }
      });

      const resultado = await AuthService.register({
        email: 'pro@argendar.com',
        password: 'Password123',
        first_name: 'Mario',
        last_name: 'Gómez',
        role: 'professional'
      });

      expect(resultado.user.role).toBe('professional');
      expect(resultado.user.is_onboarding_complete).toBe(false);
      expect(upsertProfMock).toHaveBeenCalledWith(
        expect.objectContaining({
          usuario_id: mockUserId,
          onboarding_completo: false,
          calificacion_promedio: 0
        })
      );
    });

    test('debe arrojar error explícito si el correo ya está registrado', async () => {
      jest.spyOn(supabase.auth, 'signUp').mockResolvedValue({
        data: {},
        error: { message: 'User already registered', status: 422 }
      });

      await expect(
        AuthService.register({
          email: 'existente@argendar.com',
          password: 'Password123',
          first_name: 'Juan',
          last_name: 'Pérez'
        })
      ).rejects.toThrow('Este correo ya está registrado en Argendar');
    });
  });

  describe('login (HU-03)', () => {
    test('debe arrojar 401 con credenciales inválidas', async () => {
      jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: {},
        error: { message: 'Invalid login credentials', status: 400 }
      });

      await expect(
        AuthService.login({ email: 'fake@argendar.com', password: 'WrongPassword' })
      ).rejects.toThrow('Correo o contraseña incorrectos');
    });

    test('debe bloquear el login si la cuenta está suspendida (esta_suspendido = true)', async () => {
      const mockUserId = '33333333-3333-3333-3333-333333333333';
      jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: {
          user: { id: mockUserId, email: 'suspendido@argendar.com' },
          session: { access_token: 'token' }
        },
        error: null
      });

      jest.spyOn(supabaseAdmin, 'from').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: mockUserId, rol: 'client', esta_suspendido: true },
          error: null
        })
      });

      await expect(
        AuthService.login({ email: 'suspendido@argendar.com', password: 'Password123' })
      ).rejects.toThrow('Tu cuenta se encuentra suspendida. Contactá a soporte');
    });

    test('debe autenticar exitosamente y retornar token y datos del usuario', async () => {
      const mockUserId = '44444444-4444-4444-4444-444444444444';
      jest.spyOn(supabase.auth, 'signInWithPassword').mockResolvedValue({
        data: {
          user: { id: mockUserId, email: 'activo@argendar.com' },
          session: { access_token: 'valid-jwt-token', refresh_token: 'ref', expires_in: 3600, token_type: 'bearer' }
        },
        error: null
      });

      jest.spyOn(supabaseAdmin, 'from').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: { id: mockUserId, rol: 'client', nombre: 'Ana', apellido: 'López', esta_suspendido: false },
          error: null
        })
      });

      const resultado = await AuthService.login({ email: 'activo@argendar.com', password: 'Password123' });

      expect(resultado.user.id).toBe(mockUserId);
      expect(resultado.user.is_suspended).toBe(false);
      expect(resultado.session.access_token).toBe('valid-jwt-token');
    });
  });

  describe('recoverPassword (HU-04)', () => {
    test('debe retornar mensaje de confirmación sin exponer errores de enumeración', async () => {
      jest.spyOn(supabase.auth, 'resetPasswordForEmail').mockResolvedValue({
        data: {},
        error: null
      });

      const res = await AuthService.recoverPassword({ email: 'user@argendar.com' });

      expect(res.message).toContain('Si el correo electrónico está registrado');
    });
  });
});
