import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
import { describe, test, expect, beforeAll } from '@jest/globals';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Faltan variables de entorno necesarias (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY).');
}

// Cliente anónimo (simula frontend / cliente público)
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

// Cliente administrador (para aserciones y operaciones de prueba con bypass de RLS)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
});

describe('Suite de Pruebas de Seguridad y Funcionalidad: Módulo de Auditoría (DevSecOps)', () => {

  const testIp = '203.0.113.195';
  const testUserAgent = 'Jest-DevSecOps-Automated-Runner/1.0';

  beforeAll(async () => {
    expect(SUPABASE_URL).toBeDefined();
  });

  /**
   * 1. Test de Login Fallido (Tracking de IPs sospechosas y correos no existentes)
   */
  test('TC-01: Registro de login fallido captura IP y user_agent manteniendo user_id en NULL para emails inexistentes', async () => {
    const fakeEmail = `nonexistent_${Date.now()}@securitytest.com`;

    // Invocación de la RPC log_failed_login
    const { error: rpcError } = await supabaseAdmin.rpc('log_failed_login', {
      p_email: fakeEmail,
      p_ip_address: testIp,
      p_user_agent: testUserAgent,
      p_reason: 'Credenciales inválidas - Prueba QA'
    });

    expect(rpcError).toBeNull();

    // Verificación administrativa mediante la RPC segura get_audit_records
    const { data: auditRecords, error: fetchError } = await supabaseAdmin.rpc('get_audit_records', {
      p_ip: testIp
    });

    expect(fetchError).toBeNull();
    expect(auditRecords).toBeDefined();
    expect(auditRecords.length).toBeGreaterThanOrEqual(1);

    const record = auditRecords[0];
    expect(record.status).toBe('failed');
    expect(record.user_id).toBeNull();
    expect(record.session_id).toBeNull();
    expect(record.ip_address).toBe(testIp);
    expect(record.user_agent).toBe(testUserAgent);
    expect(record.reason).toBe('Credenciales inválidas - Prueba QA');
  });

  /**
   * 2. Test de Login Exitoso (Trigger automático sobre auth.sessions)
   */
  test('TC-02: Trigger log_successful_login captura automáticamente inserciones en auth.sessions con status = success', async () => {
    // 1. Crear un usuario de prueba en auth.users
    const testUserEmail = `qa_success_user_${Date.now()}@test.com`;
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testUserEmail,
      password: 'TestPassword123!',
      email_confirm: true
    });

    expect(userError).toBeNull();
    const createdUserId = userData.user.id;

    // 2. Crear una sesión en auth.sessions usando el helper RPC test_create_session
    const sampleIp = '198.51.100.42';
    const sampleUserAgent = 'Jest-DevSecOps-Successful-Session/2.0';

    const { data: sessionId, error: sessionInsertError } = await supabaseAdmin.rpc('test_create_session', {
      p_user_id: createdUserId,
      p_ip: sampleIp,
      p_user_agent: sampleUserAgent
    });

    expect(sessionInsertError).toBeNull();
    expect(sessionId).toBeDefined();

    // 3. Verificar que el trigger trg_log_successful_login haya insertado en audit.login_history
    const { data: auditRecords, error: fetchError } = await supabaseAdmin.rpc('get_audit_records', {
      p_ip: sampleIp
    });

    expect(fetchError).toBeNull();
    expect(auditRecords).toBeDefined();
    expect(auditRecords.length).toBeGreaterThanOrEqual(1);

    const record = auditRecords.find(r => r.session_id === sessionId);
    expect(record).toBeDefined();
    expect(record.status).toBe('success');
    expect(record.user_id).toBe(createdUserId);
    expect(record.session_id).toBe(sessionId);
    expect(record.ip_address).toBe(sampleIp);
    expect(record.user_agent).toBe(sampleUserAgent);

    // Limpieza del usuario de prueba
    await supabaseAdmin.auth.admin.deleteUser(createdUserId);
  });

  /**
   * 3. Test de Fuga de Datos (Data Leakage Protection)
   */
  test('TC-03: Cliente anónimo/público NO puede acceder al esquema audit ni consultar audit.login_history', async () => {
    // Intento de consulta directa a la tabla audit.login_history desde el cliente anónimo
    const { data, error } = await supabaseAnon
      .schema('audit')
      .from('login_history')
      .select('*');

    // Debe retornar error por denegación de permisos en el esquema / tabla RLS
    expect(error).not.toBeNull();
    expect(data).toBeNull();
  });

  /**
   * 4. Test de Inmutabilidad Criptográfica (Trigger prevent_update_delete)
   */
  test('TC-04: Intentos de UPDATE en audit.login_history son bloqueados por el trigger de inmutabilidad', async () => {
    // 1. Obtener un registro de auditoría existente
    const { data: auditRecords, error: fetchError } = await supabaseAdmin.rpc('get_audit_records', {
      p_ip: testIp
    });

    expect(fetchError).toBeNull();
    expect(auditRecords.length).toBeGreaterThanOrEqual(1);
    const targetRecordId = auditRecords[0].id;

    // 2. Intentar modificar (UPDATE) el registro a través de la función de prueba
    const { error: updateError } = await supabaseAdmin.rpc('test_update_audit_record', {
      p_id: targetRecordId
    });

    expect(updateError).not.toBeNull();
    expect(updateError.message).toContain('inmutable');
  });

});
