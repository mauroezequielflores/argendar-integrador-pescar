/**
 * QA Automation Integration Test Suite (DevSecOps - SDET)
 * Validación de Ciclo de Vida Completo: Registro, Login, Historial de Dispositivos & Aislamiento RLS
 * 
 * Tecnologías: Node.js, Express, Jest, Supertest, Supabase PostgreSQL (RLS & Triggers)
 */
import request from 'supertest';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../index.js';

// Cargar variables de entorno (apoya .env.test o .env)
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
dotenv.config(); // Fallback general a .env si .env.test no existe

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("ERROR CRÍTICO: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridos para la suite de integración.");
}

// Cliente de Supabase con privilegios administrativos (Service Role) para verificación directa en BD y limpieza
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

describe('Suite de Pruebas de Integración: Registro, Login, Historial & Seguridad RLS', () => {

  // Prefijo identificador exclusivo para mantener higiene de BD en entorno de pruebas
  const TEST_PREFIX = `test_user_${Date.now()}`;
  
  // Datos y estado en memoria para el Usuario A
  const usuarioA = {
    nombre: 'QA',
    apellido: 'Automation_A',
    email: `${TEST_PREFIX}_a@argendar.test`,
    password: 'PasswordSeguro_123!_A',
    id: null,
    accessToken: null
  };

  // Datos y estado en memoria para el Usuario B (Pruebas de Aislamiento RLS)
  const usuarioB = {
    nombre: 'QA',
    apellido: 'Automation_B',
    email: `${TEST_PREFIX}_b@argendar.test`,
    password: 'PasswordSeguro_123!_B',
    id: null,
    accessToken: null
  };

  // Lista de IDs creados en auth.users para asegurar eliminación física durante Teardown
  const createdUserIds = [];

  /**
   * FASE 1: Configuración del Entorno de Pruebas (Setup & Teardown)
   */
  beforeAll(async () => {
    console.log(`[QA SDET Setup]: Iniciando suite con prefijo de prueba "${TEST_PREFIX}"...`);
    // Limpieza previa preventiva por si existen correos remanentes idénticos
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    if (usersData?.users) {
      for (const u of usersData.users) {
        if (u.email && u.email.startsWith('test_user_')) {
          await supabaseAdmin.auth.admin.deleteUser(u.id).catch(() => {});
        }
      }
    }
  });

  afterAll(async () => {
    console.log(`[QA SDET Teardown]: Eliminando físicamente todos los registros de prueba para higiene de BD...`);
    
    // 1. Eliminar historial de dispositivos asociado a los usuarios de prueba en public.historial_dispositivos
    if (createdUserIds.length > 0) {
      await supabaseAdmin
        .from('historial_dispositivos')
        .delete()
        .in('user_id', createdUserIds);

      // 2. Eliminar explícitamente en public.usuarios (en caso de no actuar cascada)
      await supabaseAdmin
        .from('usuarios')
        .delete()
        .in('id', createdUserIds);

      // 3. CRÍTICO: Eliminar los usuarios físicamente de auth.users usando el Service Role
      for (const userId of createdUserIds) {
        const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (delErr) {
          console.warn(`[QA SDET Teardown Warning]: No se pudo eliminar auth.user con ID ${userId}:`, delErr.message);
        } else {
          console.log(`[QA SDET Teardown]: Usuario de prueba eliminado físicamente de auth.users: ${userId}`);
        }
      }
    }
  });

  /**
   * FASE 2: Pruebas de Registro (Sincronización Auth -> Public)
   */
  describe('Fase 2: Registro de Usuario & Sincronización con public.usuarios', () => {

    it('debe registrar al Usuario A a través de /api/v1/auth/register y sincronizar su perfil en public.usuarios via trigger', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: usuarioA.nombre,
          apellido: usuarioA.apellido,
          email: usuarioA.email,
          password: usuarioA.password
        });

      // Afirmaciones sobre la respuesta HTTP de registro
      expect(response.status).toBe(201);
      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(usuarioA.email);

      usuarioA.id = response.body.data.user.id;
      expect(usuarioA.id).toBeDefined();
      createdUserIds.push(usuarioA.id);

      // Esperar brevemente a que el trigger de BD (on_auth_user_created -> handle_new_user) impacte
      await new Promise(resolve => setTimeout(resolve, 800));

      // Verificación directa en BD (Service Role) del registro insertado en public.usuarios
      const { data: dbUser, error: dbError } = await supabaseAdmin
        .from('usuarios')
        .select('id, nombre, apellido, email')
        .eq('id', usuarioA.id)
        .single();

      expect(dbError).toBeNull();
      expect(dbUser).toBeDefined();
      expect(dbUser.id).toBe(usuarioA.id);
      expect(dbUser.nombre).toBe(usuarioA.nombre);
      expect(dbUser.apellido).toBe(usuarioA.apellido);
      expect(dbUser.email).toBe(usuarioA.email);
    });

    it('debe registrar al Usuario B (para escenarios comparativos de RLS)', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          nombre: usuarioB.nombre,
          apellido: usuarioB.apellido,
          email: usuarioB.email,
          password: usuarioB.password
        });

      expect(response.status).toBe(201);
      usuarioB.id = response.body.data.user.id;
      expect(usuarioB.id).toBeDefined();
      createdUserIds.push(usuarioB.id);

      await new Promise(resolve => setTimeout(resolve, 800));

      // Afirmar en BD que el usuario B existe en public.usuarios
      const { data: dbUserB, error: dbErrB } = await supabaseAdmin
        .from('usuarios')
        .select('id, email')
        .eq('id', usuarioB.id)
        .single();

      expect(dbErrB).toBeNull();
      expect(dbUserB.id).toBe(usuarioB.id);
    });

  });

  /**
   * FASE 3: Pruebas de Inicio de Sesión e Historial
   */
  describe('Fase 3: Inicio de Sesión & Impacto Directo en public.historial_dispositivos', () => {

    it('debe iniciar sesión exitosamente para el Usuario A, obtener token JWT y registrar en historial_dispositivos', async () => {
      const targetUserAgent = 'SDET-Automated-Client/2026.0 (Windows NT 10.0; QA Integration)';
      const targetIp = '198.51.100.42';

      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('User-Agent', targetUserAgent)
        .set('X-Forwarded-For', targetIp)
        .send({
          email: usuarioA.email,
          password: usuarioA.password
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(response.body.data.session).toBeDefined();
      
      usuarioA.accessToken = response.body.data.session.accessToken;
      expect(usuarioA.accessToken).toBeDefined();

      // Damos una espera de 800ms para asegurar el asentamiento del registro asíncrono no bloqueante
      await new Promise(resolve => setTimeout(resolve, 800));

      // Impacto en BD: Consultar directamente public.historial_dispositivos utilizando el Service Role SDK
      const { data: historialRecords, error: histError } = await supabaseAdmin
        .from('historial_dispositivos')
        .select('*')
        .eq('user_id', usuarioA.id)
        .order('login_time', { ascending: false });

      expect(histError).toBeNull();
      expect(historialRecords).toBeDefined();
      expect(historialRecords.length).toBeGreaterThanOrEqual(1);

      // Validar las columnas requeridas (user_id, ip_address, user_agent)
      const lastLoginRecord = historialRecords[0];
      expect(lastLoginRecord.user_id).toBe(usuarioA.id);
      expect(lastLoginRecord.user_agent).toBe(targetUserAgent);
      expect(lastLoginRecord.ip_address).toBe(targetIp);
      expect(lastLoginRecord.login_time).toBeDefined();
    });

    it('debe iniciar sesión exitosamente para el Usuario B y generar su propio historial', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .set('User-Agent', 'SDET-Automated-Client-B/2026.0')
        .set('X-Forwarded-For', '198.51.100.99')
        .send({
          email: usuarioB.email,
          password: usuarioB.password
        });

      expect(response.status).toBe(200);
      usuarioB.accessToken = response.body.data.session.accessToken;
      expect(usuarioB.accessToken).toBeDefined();

      await new Promise(resolve => setTimeout(resolve, 800));

      const { data: histB } = await supabaseAdmin
        .from('historial_dispositivos')
        .select('*')
        .eq('user_id', usuarioB.id);

      expect(histB.length).toBeGreaterThanOrEqual(1);
    });

  });

  /**
   * FASE 4: Pruebas de Seguridad (Row Level Security - RLS)
   */
  describe('Fase 4: Validación de Aislamiento RLS en Historial de Dispositivos', () => {

    it('debe retornar HTTP 200 y la lista exclusiva de dispositivos del Usuario A en GET /api/v1/usuarios/me/historial-dispositivos', async () => {
      const response = await request(app)
        .get('/api/v1/usuarios/me/historial-dispositivos')
        .set('Authorization', `Bearer ${usuarioA.accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);

      // Afirmar que cada registro retornado en la respuesta le pertenezca exactamente al Usuario A
      for (const record of response.body.data) {
        expect(record.user_id).toBe(usuarioA.id);
      }
    });

    it('debe impedir por políticas RLS que el Usuario A acceda al historial del Usuario B inyectando su user_id', async () => {
      // Instanciamos el cliente de Supabase apuntando al JWT autenticado del USUARIO A
      const supabaseClientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
        realtime: { transport: ws },
        global: {
          headers: { Authorization: `Bearer ${usuarioA.accessToken}` }
        }
      });

      // Intento de inyección/ataque: El Usuario A consulta explícitamente los registros donde user_id === Usuario B
      const { data: unauthorizedData, error: rlsError } = await supabaseClientA
        .from('historial_dispositivos')
        .select('*')
        .eq('user_id', usuarioB.id);

      // Validación RLS: Gracias a "auth.uid() = user_id", la base de datos no devuelve ningún registro del Usuario B
      expect(rlsError).toBeNull();
      expect(unauthorizedData).toBeDefined();
      expect(Array.isArray(unauthorizedData)).toBe(true);
      expect(unauthorizedData.length).toBe(0);
    });

    it('debe impedir que el Usuario A consulte toda la tabla sin filtros (sólo podrá ver su propio subconjunto de filas)', async () => {
      const supabaseClientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: false },
        realtime: { transport: ws },
        global: {
          headers: { Authorization: `Bearer ${usuarioA.accessToken}` }
        }
      });

      // El Usuario A solicita "SELECT * FROM historial_dispositivos" sin cláusula WHERE
      const { data: allAccessibleRows, error } = await supabaseClientA
        .from('historial_dispositivos')
        .select('*');

      expect(error).toBeNull();
      expect(allAccessibleRows.length).toBeGreaterThanOrEqual(1);

      // Confirmar que NINGUNA de las filas recuperadas corresponda al Usuario B o a otro ID que no sea Usuario A
      const containsUserB = allAccessibleRows.some(row => row.user_id === usuarioB.id);
      expect(containsUserB).toBe(false);
    });

  });

});
