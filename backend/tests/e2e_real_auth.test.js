process.env.NODE_ENV = 'test';

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';
import { supabaseAdmin, supabase } from '../config/supabase.js';

describe('Épica de Registro y Autenticación (EP-AUTH) - Suite E2E Real con Persistencia en Base de Datos', () => {

  let clienteToken = '';
  let profesionalToken = '';
  let clienteId = '';
  let profesionalId = '';
  let suspendidoId = '';

  const PERMANENT_CLIENT_EMAIL = 'test_permanente_cliente@argendar.com';
  const PERMANENT_PROF_EMAIL = 'test_permanente_profesional@argendar.com';
  const PERMANENT_SUSPENDED_EMAIL = 'test_suspendido@argendar.com';
  const DEFAULT_PASSWORD = 'Password123!';

  before(async () => {
    // 1. Asegurar existencia y configuración de usuarios persistentes en Supabase Auth y BD
    const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
    const users = userList?.users || [];

    // Setup / Garantía de Usuario Cliente Permanente
    const user1 = users.find(u => u.email === PERMANENT_CLIENT_EMAIL) || users[0];
    if (user1) {
      clienteId = user1.id;
      await supabaseAdmin.auth.admin.updateUserById(user1.id, {
        email: PERMANENT_CLIENT_EMAIL,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: 'Cliente',
          last_name: 'Permanente',
          role: 'client',
          is_suspended: false
        }
      });
    }

    // Setup / Garantía de Usuario Profesional Permanente
    const user2 = users.find(u => u.email === PERMANENT_PROF_EMAIL) || users[1];
    if (user2) {
      profesionalId = user2.id;
      await supabaseAdmin.auth.admin.updateUserById(user2.id, {
        email: PERMANENT_PROF_EMAIL,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: 'Profesional',
          last_name: 'Permanente',
          role: 'professional',
          is_suspended: false,
          is_onboarding_complete: false
        }
      });
    }

    // Setup / Garantía de Usuario Suspendido Permanente
    const user3 = users.find(u => u.email === PERMANENT_SUSPENDED_EMAIL) || users[2];
    if (user3) {
      suspendidoId = user3.id;
      await supabaseAdmin.auth.admin.updateUserById(user3.id, {
        email: PERMANENT_SUSPENDED_EMAIL,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: {
          first_name: 'Usuario',
          last_name: 'Suspendido',
          role: 'client',
          is_suspended: true
        }
      });
    }
  });

  describe('1. Verificación de Persistencia de Datos en Base de Datos Real (Supabase)', () => {
    test('Verificar que los usuarios de prueba permanentes existen en auth.users y perfiles', async () => {
      const { data: userList, error } = await supabaseAdmin.auth.admin.listUsers();
      assert.equal(error, null, 'No debe haber error al consultar Supabase');
      
      const foundClient = userList.users.find(u => u.email === PERMANENT_CLIENT_EMAIL);
      const foundProf = userList.users.find(u => u.email === PERMANENT_PROF_EMAIL);
      const foundSuspended = userList.users.find(u => u.email === PERMANENT_SUSPENDED_EMAIL);

      assert.ok(foundClient, 'El usuario cliente permanente debe existir en la base de datos');
      assert.ok(foundProf, 'El usuario profesional permanente debe existir en la base de datos');
      assert.ok(foundSuspended, 'El usuario suspendido debe existir en la base de datos');

      assert.equal(foundClient.user_metadata.role, 'client');
      assert.equal(foundProf.user_metadata.role, 'professional');
      assert.equal(foundProf.user_metadata.is_onboarding_complete, false);
      assert.equal(foundSuspended.user_metadata.is_suspended, true);
    });
  });

  describe('2. Pruebas de Registro (HU-01 y HU-02)', () => {
    test('Validación 409 Conflict al intentar registrar un email ya existente', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: PERMANENT_CLIENT_EMAIL,
          password: 'Password123!',
          first_name: 'Carlos',
          last_name: 'Pérez',
          role: 'client'
        });

      assert.equal(response.status, 409);
      assert.equal(response.body.status, 'error');
      assert.ok(
        response.body.message.includes('ya está registrado') ||
        response.body.message.includes('registrado en Argendar')
      );
    });

    test('Validación 400 Bad Request ante contraseña débil en registro', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'nuevo_usuario_invalido@argendar.com',
          password: 'debil',
          first_name: 'Carlos',
          last_name: 'Pérez',
          role: 'client'
        });

      assert.equal(response.status, 400);
      assert.equal(response.body.status, 'error');
      assert.ok(response.body.errors.some(e => e.includes('8 caracteres')));
    });

    test('Validación 400 Bad Request ante campos obligatorios faltantes', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: '',
          password: '',
          first_name: '',
          last_name: ''
        });

      assert.equal(response.status, 400);
      assert.equal(response.body.status, 'error');
      assert.ok(response.body.errors.length >= 3);
    });
  });

  describe('3. Pruebas de Inicio de Sesión (HU-03)', () => {
    test('Login exitoso para Cliente: Genera y retorna token JWT y datos de perfil', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: PERMANENT_CLIENT_EMAIL,
          password: DEFAULT_PASSWORD
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.status, 'success');
      assert.ok(response.body.data.session.access_token, 'Debe retornar un access_token JWT');
      assert.equal(response.body.data.user.role, 'client');
      assert.equal(response.body.data.user.is_suspended, false);

      clienteToken = response.body.data.session.access_token;
    });

    test('Login exitoso para Profesional: Retorna JWT y perfil con is_onboarding_complete = false', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: PERMANENT_PROF_EMAIL,
          password: DEFAULT_PASSWORD
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.status, 'success');
      assert.ok(response.body.data.session.access_token, 'Debe retornar access_token');
      assert.equal(response.body.data.user.role, 'professional');
      assert.equal(response.body.data.user.is_onboarding_complete, false);

      profesionalToken = response.body.data.session.access_token;
    });

    test('Login fallido por credenciales incorrectas: Retorna HTTP 401', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: PERMANENT_CLIENT_EMAIL,
          password: 'PasswordIncorrecta999!'
        });

      assert.equal(response.status, 401);
      assert.equal(response.body.status, 'error');
      assert.equal(response.body.message, 'Correo o contraseña incorrectos');
    });

    test('Login rechazado para usuario con is_suspended = true: Retorna HTTP 403', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: PERMANENT_SUSPENDED_EMAIL,
          password: DEFAULT_PASSWORD
        });

      assert.equal(response.status, 403);
      assert.equal(response.body.status, 'error');
      assert.ok(response.body.message.includes('suspendida'));
    });
  });

  describe('4. Middlewares y Seguridad en Endpoints Protegidos', () => {
    test('GET /api/v1/auth/me: Retorna perfil completo con token válido', async () => {
      assert.ok(clienteToken, 'Debe tener token de cliente');

      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${clienteToken}`);

      assert.equal(response.status, 200);
      assert.equal(response.body.status, 'success');
      assert.equal(response.body.data.user.email, PERMANENT_CLIENT_EMAIL);
      assert.equal(response.body.data.user.role, 'client');
    });

    test('GET /api/v1/auth/me: Bloquea con 401 si no se envía token', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me');

      assert.equal(response.status, 401);
      assert.equal(response.body.status, 'error');
    });

    test('Acceso denegado (403) a feed de trabajos cuando un profesional tiene is_onboarding_complete = false', async () => {
      assert.ok(profesionalToken, 'Debe tener token de profesional');

      const response = await request(app)
        .get('/api/v1/job-requests/feed')
        .set('Authorization', `Bearer ${profesionalToken}`);

      assert.equal(response.status, 403);
      assert.equal(response.body.status, 'error');
      assert.equal(response.body.code, 'ONBOARDING_INCOMPLETE');
      assert.ok(response.body.message.includes('onboarding'));
    });

    test('POST /api/v1/auth/recover-password: Responde exitosamente protegiendo la privacidad', async () => {
      const response = await request(app)
        .post('/api/v1/auth/recover-password')
        .send({
          email: PERMANENT_CLIENT_EMAIL
        });

      assert.equal(response.status, 200);
      assert.equal(response.body.status, 'success');
      assert.ok(response.body.message.includes('Si el correo electrónico está registrado'));
    });
  });
});
