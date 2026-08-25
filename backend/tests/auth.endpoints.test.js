import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../index.js';
import { AuthService } from '../services/auth.service.js';

describe('Endpoints de Autenticación (API REST)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    test('debe retornar 201 y datos de sesión al registrar cliente válido', async () => {
      jest.spyOn(AuthService, 'register').mockResolvedValue({
        user: {
          id: '123-abc',
          email: 'nuevo@argendar.com',
          role: 'client',
          first_name: 'Carlos',
          last_name: 'Paz',
          is_suspended: false
        },
        session: { access_token: 'token-123' }
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'nuevo@argendar.com',
          password: 'Password123',
          first_name: 'Carlos',
          last_name: 'Paz',
          role: 'client'
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.email).toBe('nuevo@argendar.com');
      expect(res.body.data.session.access_token).toBe('token-123');
    });

    test('debe retornar 400 cuando los datos no cumplen con las reglas de validación', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'email-invalido',
          password: '123',
          first_name: '',
          last_name: ''
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.errors.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    test('debe retornar 200 y el JWT de sesión tras login exitoso', async () => {
      jest.spyOn(AuthService, 'login').mockResolvedValue({
        user: {
          id: 'user-xyz',
          email: 'login@argendar.com',
          role: 'professional',
          first_name: 'Lucía',
          last_name: 'Méndez',
          is_suspended: false,
          is_onboarding_complete: true
        },
        session: { access_token: 'jwt-login-token' }
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'login@argendar.com',
          password: 'Password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.session.access_token).toBe('jwt-login-token');
      expect(res.body.data.user.is_onboarding_complete).toBe(true);
    });

    test('debe retornar 401 si las credenciales son incorrectas', async () => {
      const err = new Error('Correo o contraseña incorrectos');
      err.status = 401;
      jest.spyOn(AuthService, 'login').mockRejectedValue(err);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'erroneo@argendar.com',
          password: 'Password123'
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Correo o contraseña incorrectos');
    });

    test('debe retornar 403 si la cuenta está suspendida', async () => {
      const err = new Error('Tu cuenta se encuentra suspendida. Contactá a soporte');
      err.status = 403;
      jest.spyOn(AuthService, 'login').mockRejectedValue(err);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'suspendido@argendar.com',
          password: 'Password123'
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toBe('Tu cuenta se encuentra suspendida. Contactá a soporte');
    });
  });

  describe('POST /api/v1/auth/recover-password', () => {
    test('debe retornar 200 con mensaje genérico seguro', async () => {
      jest.spyOn(AuthService, 'recoverPassword').mockResolvedValue({
        message: 'Si el correo electrónico está registrado en Argendar, recibirás un enlace para restablecer tu contraseña.'
      });

      const res = await request(app)
        .post('/api/v1/auth/recover-password')
        .send({
          email: 'usuario@argendar.com'
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.message).toContain('Si el correo electrónico está registrado');
    });
  });
});
