/**
 * QA Automation Integration Test Suite - Modo Persistente (Inspección Visual en BD)
 * Este test ejecuta el ciclo de vida de Registro, Login e Historial, pero NO elimina los datos al finalizar.
 * Permite al usuario o auditor inspeccionar los registros creados en auth.users, public.usuarios y public.historial_dispositivos.
 */
import request from 'supertest';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import app from '../index.js';

dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

describe('Suite de Pruebas Persistente: Registro, Login e Historial (Sin Teardown para Inspección)', () => {

  const timestamp = Date.now();
  const PERSIST_PREFIX = `demo_inspect_${timestamp}`;
  
  const usuarioDemoA = {
    nombre: 'Mauricio',
    apellido: 'Inspector_A',
    email: `${PERSIST_PREFIX}_a@argendar.test`,
    password: 'PasswordDemo123!_A',
    id: null,
    accessToken: null
  };

  const usuarioDemoB = {
    nombre: 'Lucia',
    apellido: 'Inspector_B',
    email: `${PERSIST_PREFIX}_b@argendar.test`,
    password: 'PasswordDemo123!_B',
    id: null,
    accessToken: null
  };

  beforeAll(async () => {
    console.log(`[Demo Persistente Setup]: Iniciando creación de usuarios para inspección ("${PERSIST_PREFIX}")...`);
  });

  afterAll(async () => {
    console.log('\n========================================================================');
    console.log('  ¡DATOS PERSISTIDOS EN BASE DE DATOS PARA INSPECCIÓN EN SUPABASE!');
    console.log('========================================================================');
    console.log(`- Usuario Demo A: ${usuarioDemoA.email} (ID: ${usuarioDemoA.id})`);
    console.log(`- Usuario Demo B: ${usuarioDemoB.email} (ID: ${usuarioDemoB.id})`);
    console.log('  puedes verificar las tablas public.usuarios y public.historial_dispositivos.');
    console.log('========================================================================\n');
  });

  it('1. Debe registrar los usuarios en /api/v1/auth/register y persistir en public.usuarios', async () => {
    // Registro Usuario A
    const resA = await request(app)
      .post('/api/v1/auth/register')
      .send(usuarioDemoA);
    expect(resA.status).toBe(201);
    usuarioDemoA.id = resA.body.data.user.id;
    expect(usuarioDemoA.id).toBeDefined();

    // Registro Usuario B
    const resB = await request(app)
      .post('/api/v1/auth/register')
      .send(usuarioDemoB);
    expect(resB.status).toBe(201);
    usuarioDemoB.id = resB.body.data.user.id;
    expect(usuarioDemoB.id).toBeDefined();

    // Esperamos que actúe el trigger on_auth_user_created -> handle_new_user
    await new Promise(resolve => setTimeout(resolve, 800));

    // Validar existencia en public.usuarios
    const { data: dbUserA } = await supabaseAdmin
      .from('usuarios')
      .select('id, nombre, apellido, email')
      .eq('id', usuarioDemoA.id)
      .single();

    expect(dbUserA.email).toBe(usuarioDemoA.email);
    expect(dbUserA.nombre).toBe(usuarioDemoA.nombre);
  });

  it('2. Debe iniciar sesión con ambos usuarios y persistir sus registros en public.historial_dispositivos', async () => {
    // Login Usuario A (Simulando Chrome en Windows)
    const resLoginA = await request(app)
      .post('/api/v1/auth/login')
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36 [Demo Inspect]')
      .set('X-Forwarded-For', '181.16.42.10')
      .send({ email: usuarioDemoA.email, password: usuarioDemoA.password });
    
    expect(resLoginA.status).toBe(200);
    usuarioDemoA.accessToken = resLoginA.body.data.session.accessToken;

    // Login Usuario B (Simulando Safari en iPhone)
    const resLoginB = await request(app)
      .post('/api/v1/auth/login')
      .set('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) AppleWebKit/605.1.15 Safari/604.1 [Demo Inspect]')
      .set('X-Forwarded-For', '200.45.192.88')
      .send({ email: usuarioDemoB.email, password: usuarioDemoB.password });

    expect(resLoginB.status).toBe(200);
    usuarioDemoB.accessToken = resLoginB.body.data.session.accessToken;

    // Esperar registro asíncrono
    await new Promise(resolve => setTimeout(resolve, 800));

    // Constatar en la base de datos
    const { data: historialesA } = await supabaseAdmin
      .from('historial_dispositivos')
      .select('*')
      .eq('user_id', usuarioDemoA.id);

    expect(historialesA.length).toBeGreaterThanOrEqual(1);
    expect(historialesA[0].ip_address).toBe('181.16.42.10');

    const { data: historialesB } = await supabaseAdmin
      .from('historial_dispositivos')
      .select('*')
      .eq('user_id', usuarioDemoB.id);

    expect(historialesB.length).toBeGreaterThanOrEqual(1);
    expect(historialesB[0].ip_address).toBe('200.45.192.88');
  });

  it('3. Debe verificar el endpoint de consulta del historial para Usuario A (HTTP 200 OK)', async () => {
    const response = await request(app)
      .get('/api/v1/usuarios/me/historial-dispositivos')
      .set('Authorization', `Bearer ${usuarioDemoA.accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    expect(response.body.data[0].user_agent).toContain('[Demo Inspect]');
  });

});
