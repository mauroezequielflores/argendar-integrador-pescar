import request from 'supertest';
import app from '../src/app.js';
import { supabase } from '../src/config/supabase.js';

// Hacemos mock de supabase para no pegar a la base de datos real
jest.mock('../src/config/supabase.js', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
    },
  },
}));

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('Debe registrar un usuario exitosamente (201)', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: { user: { id: 'uuid-123', email: 'test@example.com' } },
        error: null,
      });

      const response = await request(app).post('/api/v1/auth/register').send({
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'test@example.com',
        password: 'Password123',
        role: 'client',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'uuid-123');
      expect(response.body).toHaveProperty('email', 'test@example.com');
    });

    it('Debe fallar (400) si falta el email', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        nombre: 'Juan',
        apellido: 'Perez',
        password: 'Password123',
        role: 'client',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('Debe fallar (409) si el usuario ya existe', async () => {
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered', status: 422 },
      });

      const response = await request(app).post('/api/v1/auth/register').send({
        nombre: 'Juan',
        apellido: 'Perez',
        email: 'existente@example.com',
        password: 'Password123',
        role: 'client',
      });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('USER_ALREADY_EXISTS');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('Debe loguear un usuario exitosamente (200)', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: 'uuid-123', email: 'test@example.com', user_metadata: { role: 'client' } },
          session: { access_token: 'fake-jwt', refresh_token: 'fake-refresh', expires_at: 12345 },
        },
        error: null,
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'Password123',
      });

      expect(response.status).toBe(200);
      expect(response.body.session).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('Debe fallar (401) con credenciales incorrectas', async () => {
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials', status: 400 },
      });

      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'test@example.com',
        password: 'WrongPassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });
});
