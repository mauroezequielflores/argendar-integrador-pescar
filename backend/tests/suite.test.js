import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarRegistro,
  validarLogin,
  validarRecuperacion
} from '../validations/auth.validation.js';
import { AuthService } from '../services/auth.service.js';
import { requireRole } from '../middlewares/roleMiddleware.js';
import { requireOnboardingComplete } from '../middlewares/onboardingMiddleware.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { supabase, supabaseAdmin } from '../config/supabase.js';

describe('Suite de Pruebas EP-AUTH (Argendar Backend)', () => {

  describe('1. Validaciones de Registro y Login (auth.validation.js)', () => {
    let req, res, next;

    beforeEach(() => {
      req = { body: {} };
      res = {
        statusCode: 200,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.data = payload;
          return this;
        }
      };
      next = () => { req.nextCalled = true; };
    });

    test('HU-01: Rechazar formato de email inválido', () => {
      req.body = { email: 'correo-sin-arroba', password: 'Password123', first_name: 'Juan', last_name: 'Pérez' };
      validarRegistro(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.equal(res.data.status, 'error');
      assert.ok(res.data.errors.some(e => e.includes('formato del correo')));
    });

    test('HU-01: Rechazar contraseña menor a 8 caracteres o sin mayúscula/número', () => {
      req.body = { email: 'valido@argendar.com', password: 'corta', first_name: 'Juan', last_name: 'Pérez' };
      validarRegistro(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('8 caracteres')));
    });

    test('HU-01: Rechazar si falta nombre o apellido', () => {
      req.body = { email: 'valido@argendar.com', password: 'Password123', first_name: '', last_name: '   ' };
      validarRegistro(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.includes('El nombre es obligatorio.'));
      assert.ok(res.data.errors.includes('El apellido es obligatorio.'));
    });

    test('HU-01: Permitir registro válido de Cliente', () => {
      req.body = { email: '  CLIENTE@argendar.com ', password: 'Password123', first_name: '  Ana ', last_name: ' Gómez ', role: 'client' };
      validarRegistro(req, res, next);
      assert.ok(req.nextCalled);
      assert.equal(req.body.email, 'cliente@argendar.com');
      assert.equal(req.body.first_name, 'Ana');
      assert.equal(req.body.last_name, 'Gómez');
      assert.equal(req.body.role, 'client');
    });

    test('HU-02: Permitir registro válido de Profesional', () => {
      req.body = { email: 'PRO@argendar.com', password: 'Password123', first_name: 'Mario', last_name: 'Rossi', role: 'professional' };
      validarRegistro(req, res, next);
      assert.ok(req.nextCalled);
      assert.equal(req.body.role, 'professional');
    });

    test('HU-03: Validar datos completos en login', () => {
      req.body = { email: '', password: '' };
      validarLogin(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.includes('El correo electrónico es obligatorio.'));
      assert.ok(res.data.errors.includes('La contraseña es obligatoria.'));
    });

    test('HU-04: Validar formato de correo en recuperación', () => {
      req.body = { email: 'invalido' };
      validarRecuperacion(req, res, next);
      assert.equal(res.statusCode, 400);

      req.body = { email: 'recuperar@argendar.com' };
      req.nextCalled = false;
      validarRecuperacion(req, res, next);
      assert.ok(req.nextCalled);
    });
  });

  describe('2. Middlewares de Seguridad', () => {
    let req, res, next;

    beforeEach(() => {
      req = { headers: {}, profile: {}, user: {} };
      res = {
        statusCode: 200,
        data: null,
        status(code) {
          this.statusCode = code;
          return this;
        },
        json(payload) {
          this.data = payload;
          return this;
        }
      };
      next = () => { req.nextCalled = true; };
    });

    test('requireRole: Permite si el rol coincide', () => {
      req.profile = { role: 'professional', rol: 'professional' };
      const mw = requireRole('professional', 'admin');
      mw(req, res, next);
      assert.ok(req.nextCalled);
    });

    test('requireRole: Bloquea con 403 si el rol no coincide', () => {
      req.profile = { role: 'client', rol: 'client' };
      const mw = requireRole('professional');
      mw(req, res, next);
      assert.equal(res.statusCode, 403);
      assert.equal(res.data.status, 'error');
    });

    test('requireOnboardingComplete: Bloquea con 403 si el usuario es cliente', async () => {
      req.user = { id: 'user-123' };
      req.profile = { role: 'client', rol: 'client' };
      await requireOnboardingComplete(req, res, next);
      assert.equal(res.statusCode, 403);
      assert.ok(res.data.message.includes('exclusiva para profesionales'));
    });

    test('requireOnboardingComplete: Bloquea con 403 (ONBOARDING_INCOMPLETE) si onboarding_completo = false', async () => {
      req.user = { id: 'pro-incomplete' };
      req.profile = { role: 'professional', rol: 'professional' };

      const originalFrom = supabaseAdmin.from;
      supabaseAdmin.from = (table) => {
        if (table === 'professional_profiles') {
          return {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: { onboarding_completo: false },
                  error: null
                })
              })
            })
          };
        }
      };

      try {
        await requireOnboardingComplete(req, res, next);
        assert.equal(res.statusCode, 403);
        assert.equal(res.data.code, 'ONBOARDING_INCOMPLETE');
      } finally {
        supabaseAdmin.from = originalFrom;
      }
    });

    test('requireOnboardingComplete: Permite acceso si onboarding_completo = true', async () => {
      req.user = { id: 'pro-complete' };
      req.profile = { role: 'professional', rol: 'professional' };

      const originalFrom = supabaseAdmin.from;
      supabaseAdmin.from = (table) => {
        if (table === 'professional_profiles') {
          return {
            select: () => ({
              eq: () => ({
                single: async () => ({
                  data: { onboarding_completo: true },
                  error: null
                })
              })
            })
          };
        }
      };

      try {
        await requireOnboardingComplete(req, res, next);
        assert.ok(req.nextCalled);
      } finally {
        supabaseAdmin.from = originalFrom;
      }
    });

    test('authMiddleware: Rechaza peticiones sin Authorization Header con 401', async () => {
      req.headers = {};
      await authMiddleware(req, res, next);
      assert.equal(res.statusCode, 401);
      assert.ok(res.data.message.includes('Token de autenticación ausente'));
    });
  });

  describe('3. Lógica de Servicios (AuthService)', () => {
    test('HU-01 & HU-02: Registro crea perfil y perfil profesional con onboarding pendiente', async () => {
      const mockId = 'user-pro-id-123';
      const originalSignUp = supabase.auth.signUp;
      const originalFrom = supabaseAdmin.from;

      let profCreated = false;

      supabase.auth.signUp = async () => ({
        data: {
          user: { id: mockId, email: 'pro@argendar.com', identities: [{}] },
          session: { access_token: 'jwt-123', refresh_token: 'rf', expires_in: 3600, token_type: 'bearer' }
        },
        error: null
      });

      supabaseAdmin.from = (table) => {
        if (table === 'profiles') {
          return {
            upsert: () => ({
              select: () => ({
                single: async () => ({
                  data: { id: mockId, rol: 'professional', nombre: 'Pro', apellido: 'Fesional', esta_suspendido: false },
                  error: null
                })
              })
            })
          };
        }
        if (table === 'professional_profiles') {
          return {
            upsert: async (payload) => {
              assert.equal(payload.usuario_id, mockId);
              assert.equal(payload.onboarding_completo, false);
              profCreated = true;
              return { data: {}, error: null };
            }
          };
        }
      };

      try {
        const result = await AuthService.register({
          email: 'pro@argendar.com',
          password: 'Password123',
          first_name: 'Pro',
          last_name: 'Fesional',
          role: 'professional'
        });

        assert.equal(result.user.id, mockId);
        assert.equal(result.user.role, 'professional');
        assert.equal(result.user.is_onboarding_complete, false);
        assert.ok(profCreated);
      } finally {
        supabase.auth.signUp = originalSignUp;
        supabaseAdmin.from = originalFrom;
      }
    });

    test('HU-03: Rechazar usuario suspendido en login con mensaje claro', async () => {
      const mockId = 'suspended-id';
      const originalSignIn = supabase.auth.signInWithPassword;
      const originalFrom = supabaseAdmin.from;

      supabase.auth.signInWithPassword = async () => ({
        data: { user: { id: mockId, email: 'suspendido@argendar.com' }, session: { access_token: 'tok' } },
        error: null
      });

      supabaseAdmin.from = () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({
              data: { id: mockId, rol: 'client', esta_suspendido: true },
              error: null
            })
          })
        })
      });

      try {
        await assert.rejects(
          async () => {
            await AuthService.login({ email: 'suspendido@argendar.com', password: 'Password123' });
          },
          (err) => {
            assert.equal(err.status, 403);
            assert.equal(err.message, 'Tu cuenta se encuentra suspendida. Contactá a soporte');
            return true;
          }
        );
      } finally {
        supabase.auth.signInWithPassword = originalSignIn;
        supabaseAdmin.from = originalFrom;
      }
    });

    test('HU-04: Reseteo de contraseña sin enumeración de usuarios', async () => {
      const originalReset = supabase.auth.resetPasswordForEmail;
      supabase.auth.resetPasswordForEmail = async () => ({ error: null });

      try {
        const res = await AuthService.recoverPassword({ email: 'usuario@argendar.com' });
        assert.ok(res.message.includes('Si el correo electrónico está registrado'));
      } finally {
        supabase.auth.resetPasswordForEmail = originalReset;
      }
    });
  });
});
