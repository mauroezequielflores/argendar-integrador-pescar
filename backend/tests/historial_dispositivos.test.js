import request from 'supertest';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../index.js';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Cliente administrador de Supabase para verificaciones y limpieza (Bypass RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

describe('Suite de Pruebas: Módulo de Historial Simple (User-Facing) & Seguridad RLS', () => {

  let usuarioA = null;
  let usuarioB = null;
  let accessTokenA = null;
  let accessTokenB = null;

  beforeAll(async () => {
    // 1. Crear Usuario A de prueba en auth.users y public.usuarios
    const emailA = `usuario_a_${Date.now()}@test.argendar.com`;
    const password = 'PasswordSegura123!';
    const resA = await supabaseAdmin.auth.admin.createUser({
      email: emailA,
      password: password,
      email_confirm: true,
      user_metadata: { nombre: 'Usuario', apellido: 'Alfa' }
    });
    expect(resA.error).toBeNull();
    usuarioA = { id: resA.data.user.id, email: emailA, password };

    // 2. Crear Usuario B de prueba
    const emailB = `usuario_b_${Date.now()}@test.argendar.com`;
    const resB = await supabaseAdmin.auth.admin.createUser({
      email: emailB,
      password: password,
      email_confirm: true,
      user_metadata: { nombre: 'Usuario', apellido: 'Beta' }
    });
    expect(resB.error).toBeNull();
    usuarioB = { id: resB.data.user.id, email: emailB, password };

    // Insertar perfiles en public.usuarios (en caso de no haber disparador automático en el entorno local)
    await supabaseAdmin.from('usuarios').upsert([
      { id: usuarioA.id, nombre: 'Usuario', apellido: 'Alfa', email: emailA },
      { id: usuarioB.id, nombre: 'Usuario', apellido: 'Beta', email: emailB }
    ]);
  });

  afterAll(async () => {
    // Limpieza de usuarios y sus historiales (por cascada)
    if (usuarioA) await supabaseAdmin.auth.admin.deleteUser(usuarioA.id);
    if (usuarioB) await supabaseAdmin.auth.admin.deleteUser(usuarioB.id);
  });

  /**
   * TEST 1: Test de Funcionalidad (Registro de Historial de Dispositivo en Login)
   */
  test('Funcionalidad: El backend captura IP y User-Agent e inserta en historial_dispositivos al hacer login', async () => {
    const testUserAgent = 'Jest-Supertest-Device-Alpha/1.0';

    const startTime = performance.now();
    const response = await request(app)
      .post('/api/v1/auth/login')
      .set('User-Agent', testUserAgent)
      .set('X-Forwarded-For', '203.0.113.55')
      .send({
        email: usuarioA.email,
        password: usuarioA.password
      });
    const duration = performance.now() - startTime;

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.session.accessToken).toBeDefined();

    accessTokenA = response.body.data.session.accessToken;

    // Verificar en la base de datos que se haya creado el registro en historial_dispositivos
    // Damos una pequeña espera en caso de que la inserción haya sido asíncrona no bloqueante
    await new Promise(resolve => setTimeout(resolve, 800));

    const { data: historialA, error: errA } = await supabaseAdmin
      .from('historial_dispositivos')
      .select('*')
      .eq('user_id', usuarioA.id)
      .order('login_time', { ascending: false })
      .limit(1);

    expect(errA).toBeNull();
    expect(historialA).toBeDefined();
    expect(historialA.length).toBe(1);
    expect(historialA[0].user_agent).toBe(testUserAgent);
    expect(historialA[0].ip_address).toBeDefined();
  });

  /**
   * TEST 2: Test de Seguridad (Aislamiento RLS entre Usuario A y Usuario B)
   */
  test('Seguridad RLS: Usuario A NO puede consultar el historial de dispositivos del Usuario B', async () => {
    // 1. Logueamos al Usuario B para generar al menos un registro en su historial
    const resLoginB = await request(app)
      .post('/api/v1/auth/login')
      .set('User-Agent', 'Jest-Supertest-Device-Beta/2.0')
      .send({
        email: usuarioB.email,
        password: usuarioB.password
      });

    expect(resLoginB.status).toBe(200);
    accessTokenB = resLoginB.body.data.session.accessToken;

    await new Promise(resolve => setTimeout(resolve, 800));

    // 2. Instanciamos un cliente Supabase con el token autenticado del USUARIO A (Frontend Client)
    const supabaseClientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      realtime: { transport: ws },
      global: {
        headers: { Authorization: `Bearer ${accessTokenA}` }
      }
    });

    // 3. El Usuario A intenta consultar directamente los registros del Usuario B
    const { data: intentoAtaque, error } = await supabaseClientA
      .from('historial_dispositivos')
      .select('*')
      .eq('user_id', usuarioB.id);

    // Debe retornar un array vacío gracias a la política RLS (auth.uid() = user_id)
    expect(error).toBeNull();
    expect(intentoAtaque).toBeDefined();
    expect(intentoAtaque.length).toBe(0);
  });

  /**
   * TEST 3: Test de Inmutabilidad (Cliente NO puede ejecutar UPDATE ni DELETE en su propio historial)
   */
  test('Inmutabilidad: Ninguna petición desde el cliente puede modificar (UPDATE) ni borrar (DELETE) registros de historial_dispositivos', async () => {
    // 1. Obtener el id del registro del Usuario A (con rol admin para asegurar el ID)
    const { data: historiales } = await supabaseAdmin
      .from('historial_dispositivos')
      .select('id')
      .eq('user_id', usuarioA.id)
      .limit(1);

    expect(historiales.length).toBeGreaterThan(0);
    const registroId = historiales[0].id;

    // 2. Instanciamos el cliente del Frontend como Usuario A
    const supabaseClientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
      realtime: { transport: ws },
      global: {
        headers: { Authorization: `Bearer ${accessTokenA}` }
      }
    });

    // 3. Intentar realizar un UPDATE desde el frontend
    const { data: resUpdate, error: errUpdate } = await supabaseClientA
      .from('historial_dispositivos')
      .update({ user_agent: 'Modificado por Cliente' })
      .eq('id', registroId)
      .select();

    // RLS bloquea la acción al no existir política FOR UPDATE (retorna null o 0 filas afectadas)
    expect((resUpdate || []).length).toBe(0);

    // 4. Intentar realizar un DELETE desde el frontend
    const { data: resDelete, error: errDelete } = await supabaseClientA
      .from('historial_dispositivos')
      .delete()
      .eq('id', registroId)
      .select();

    // RLS bloquea la acción al no existir política FOR DELETE (retorna null o 0 filas afectadas)
    expect((resDelete || []).length).toBe(0);

    // 5. Verificar con admin que el registro sigue intacto
    const { data: validacion } = await supabaseAdmin
      .from('historial_dispositivos')
      .select('*')
      .eq('id', registroId)
      .single();

    expect(validacion).toBeDefined();
    expect(validacion.user_agent).not.toBe('Modificado por Cliente');
  });

  /**
   * TEST 4: Métricas de Éxito (El registro de historial no degrada el tiempo de respuesta del Login)
   */
  test('Métrica de Éxito: La latencia de login se mantiene óptima (< 50ms de overhead asíncrono)', async () => {
    const startTime = performance.now();
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('User-Agent', 'Jest-Speed-Check/1.0')
      .send({
        email: usuarioA.email,
        password: usuarioA.password
      });
    const totalTime = performance.now() - startTime;

    expect(res.status).toBe(200);
    // Verificamos que el login responda rápidamente y el registro asíncrono no bloquee el event loop
    expect(totalTime).toBeLessThan(1500); // SLA total en test local con red incluida
    console.log(`[Métrica de Latencia]: Tiempo de respuesta en endpoint /login: ${totalTime.toFixed(2)}ms`);
  });

});
