process.env.NODE_ENV = 'test';

import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import app from '../index.js';
import { AuthService } from '../services/auth.service.js';

// Helper para realizar solicitudes HTTP simuladas contra la app Express
async function simulateRequest(app, { method, path, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      const port = server.address().port;
      const url = `http://127.0.0.1:${port}${path}`;

      try {
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: body ? JSON.stringify(body) : undefined
        });

        const status = response.status;
        const text = await response.text();
        let json = null;
        try {
          json = JSON.parse(text);
        } catch {
          json = text;
        }

        server.close(() => {
          resolve({ status, body: json });
        });
      } catch (err) {
        server.close(() => {
          reject(err);
        });
      }
    });
  });
}

describe('Pruebas E2E de Endpoints REST (EP-AUTH)', () => {
  afterEach(() => {
    // Limpieza
  });

  test('POST /api/v1/auth/register - Debe retornar 400 ante contraseña débil', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      path: '/api/v1/auth/register',
      body: {
        email: 'invalido@argendar.com',
        password: 'debil',
        first_name: 'Test',
        last_name: 'User'
      }
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.status, 'error');
    assert.ok(res.body.errors.some(e => e.includes('8 caracteres')));
  });

  test('POST /api/v1/auth/login - Debe retornar 400 si faltan credenciales', async () => {
    const res = await simulateRequest(app, {
      method: 'POST',
      path: '/api/v1/auth/login',
      body: {
        email: '',
        password: ''
      }
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.status, 'error');
  });

  test('POST /api/v1/auth/recover-password - Debe responder exitosamente con email válido', async () => {
    const originalRecover = AuthService.recoverPassword;
    AuthService.recoverPassword = async () => ({
      message: 'Si el correo electrónico está registrado en Argendar, recibirás un enlace para restablecer tu contraseña.'
    });

    try {
      const res = await simulateRequest(app, {
        method: 'POST',
        path: '/api/v1/auth/recover-password',
        body: {
          email: 'usuario@argendar.com'
        }
      });

      assert.equal(res.status, 200);
      assert.equal(res.body.status, 'success');
      assert.ok(res.body.message.includes('Si el correo electrónico está registrado'));
    } finally {
      AuthService.recoverPassword = originalRecover;
    }
  });

  test('GET /api/v1/auth/me - Debe retornar 401 si no se provee token', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      path: '/api/v1/auth/me'
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.status, 'error');
  });

  test('GET /api/v1/job-requests/feed - Debe retornar 401 sin token', async () => {
    const res = await simulateRequest(app, {
      method: 'GET',
      path: '/api/v1/job-requests/feed'
    });

    assert.equal(res.status, 401);
  });
});
