process.env.NODE_ENV = 'test';

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import app from '../index.js';
import { ProfileService } from '../services/profile.service.js';
import { supabase } from '../config/supabase.js';

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

describe('3. Endpoints REST del Módulo Perfil Profesional (profile.endpoints.test.js)', () => {

  describe('GET /api/v1/rubros (HU-08)', () => {
    test('Retorna HTTP 200 con la lista de rubros técnicos', async () => {
      const originalGetRubros = ProfileService.getRubros;
      ProfileService.getRubros = async () => [
        { id: 'b1a2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', nombre: 'Electricista', slug: 'electricista' },
        { id: 'c2b3a4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d', nombre: 'Plomero', slug: 'plomero' }
      ];

      try {
        const res = await simulateRequest(app, {
          method: 'GET',
          path: '/api/v1/rubros'
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.ok(Array.isArray(res.body.data));
        assert.equal(res.body.data.length, 2);
        assert.equal(res.body.data[0].nombre, 'Electricista');
      } finally {
        ProfileService.getRubros = originalGetRubros;
      }
    });
  });

  describe('GET /api/v1/zones (HU-09)', () => {
    test('Retorna HTTP 200 con las zonas de cobertura habilitadas', async () => {
      const originalGetZones = ProfileService.getZones;
      ProfileService.getZones = async () => [
        { id: 'z1-uuid', name: 'Caballito', city: 'CABA', province: 'Ciudad Autónoma de Buenos Aires' },
        { id: 'z2-uuid', name: 'Vicente López', city: 'GBA Norte', province: 'Buenos Aires' }
      ];

      try {
        const res = await simulateRequest(app, {
          method: 'GET',
          path: '/api/v1/zones'
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.ok(Array.isArray(res.body.data));
        assert.equal(res.body.data.length, 2);
        assert.equal(res.body.data[0].name, 'Caballito');
      } finally {
        ProfileService.getZones = originalGetZones;
      }
    });
  });

  describe('Seguridad y Autenticación en Endpoints Protegidos', () => {
    test('PUT /api/v1/profile: Rechaza petición con HTTP 401 si no hay token Bearer', async () => {
      const res = await simulateRequest(app, {
        method: 'PUT',
        path: '/api/v1/profile',
        body: { telefono: '+54 9 11 4567-8901' }
      });

      assert.equal(res.status, 401);
      assert.equal(res.body.status, 'error');
    });

    test('PUT /api/v1/professional-profile: Rechaza petición con HTTP 401 si no hay token Bearer', async () => {
      const res = await simulateRequest(app, {
        method: 'PUT',
        path: '/api/v1/professional-profile',
        body: { descripcion: 'Técnico electricista matriculado en CABA y Gran Buenos Aires.' }
      });

      assert.equal(res.status, 401);
    });

    test('GET /api/v1/professionals/:id: Rechaza con HTTP 401 si no hay token Bearer', async () => {
      const res = await simulateRequest(app, {
        method: 'GET',
        path: '/api/v1/professionals/prof-123'
      });

      assert.equal(res.status, 401);
    });
  });

  describe('Validación de Entrada en Endpoints de Perfil', () => {
    // Simular un mock de getUser para evaluar validaciones de request body
    const mockAuthUser = {
      id: 'mock-prof-user-id',
      email: 'profesional@argendar.com',
      user_metadata: { role: 'professional', nombre: 'Test', apellido: 'Prof' }
    };

    test('PUT /api/v1/profile: Retorna 400 ante formato de teléfono inválido', async () => {
      const originalGetUser = supabase.auth.getUser;
      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/profile',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: { telefono: '123' }
        });

        assert.equal(res.status, 400);
        assert.equal(res.body.status, 'error');
        assert.ok(res.body.errors.some(e => e.includes('teléfono')));
      } finally {
        supabase.auth.getUser = originalGetUser;
      }
    });

    test('PUT /api/v1/professional-profile: Retorna 400 ante descripción menor a 20 chars', async () => {
      const originalGetUser = supabase.auth.getUser;
      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: { descripcion: 'Muy corto' }
        });

        assert.equal(res.status, 400);
        assert.ok(res.body.errors.some(e => e.includes('al menos 20 caracteres')));
      } finally {
        supabase.auth.getUser = originalGetUser;
      }
    });

    test('PUT /api/v1/professional-profile: Retorna 400 ante radio de cobertura fuera de rango', async () => {
      const originalGetUser = supabase.auth.getUser;
      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: { radio_cobertura_km: 99 }
        });

        assert.equal(res.status, 400);
        assert.ok(res.body.errors.some(e => e.includes('entre 1 y 50')));
      } finally {
        supabase.auth.getUser = originalGetUser;
      }
    });

    test('PUT /api/v1/professional-profile/rubros: Retorna 400 ante arreglo vacío', async () => {
      const originalGetUser = supabase.auth.getUser;
      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile/rubros',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: { rubro_ids: [] }
        });

        assert.equal(res.status, 400);
        assert.ok(res.body.errors.some(e => e.includes('al menos un')));
      } finally {
        supabase.auth.getUser = originalGetUser;
      }
    });

    test('PUT /api/v1/professional-profile/zones: Retorna 400 ante arreglo vacío', async () => {
      const originalGetUser = supabase.auth.getUser;
      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile/zones',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: { zone_ids: [] }
        });

        assert.equal(res.status, 400);
        assert.ok(res.body.errors.some(e => e.includes('al menos una')));
      } finally {
        supabase.auth.getUser = originalGetUser;
      }
    });
  });

  describe('Actualizaciones Exitosas y Visualización Pública (HU-07 a HU-10)', () => {
    const mockAuthUser = {
      id: 'mock-prof-user-id',
      email: 'profesional@argendar.com',
      user_metadata: { role: 'professional', nombre: 'Esteban', apellido: 'Morales' }
    };

    test('PUT /api/v1/profile: Actualiza perfil básico exitosamente', async () => {
      const originalGetUser = supabase.auth.getUser;
      const originalUpdate = ProfileService.updateProfile;

      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });
      ProfileService.updateProfile = async (userId, data) => ({
        id: userId,
        nombre: 'Esteban',
        apellido: 'Morales',
        telefono: data.telefono,
        avatar_url: data.avatar_url
      });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/profile',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: {
            telefono: '+54 9 11 4567-8901',
            avatar_url: 'https://supabase.co/storage/v1/object/public/avatares/esteban.jpg'
          }
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.equal(res.body.data.telefono, '+54 9 11 4567-8901');
      } finally {
        supabase.auth.getUser = originalGetUser;
        ProfileService.updateProfile = originalUpdate;
      }
    });

    test('PUT /api/v1/professional-profile: Actualiza perfil profesional exitosamente', async () => {
      const originalGetUser = supabase.auth.getUser;
      const originalUpdateProf = ProfileService.updateProfessionalProfile;

      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });
      ProfileService.updateProfessionalProfile = async (userId, data) => ({
        id: 'prof-id-123',
        usuario_id: userId,
        descripcion: data.descripcion,
        radio_cobertura_km: data.radio_cobertura_km,
        tiene_matricula: true,
        onboarding_completo: false
      });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: {
            descripcion: 'Técnico electricista con más de 10 años de experiencia técnica en CABA.',
            radio_cobertura_km: 15,
            matricula_numero: 'MAT-4567',
            organismo_emisor: 'COPIME'
          }
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.equal(res.body.data.tiene_matricula, true);
      } finally {
        supabase.auth.getUser = originalGetUser;
        ProfileService.updateProfessionalProfile = originalUpdateProf;
      }
    });

    test('PUT /api/v1/professional-profile/rubros: Asigna rubros exitosamente', async () => {
      const originalGetUser = supabase.auth.getUser;
      const originalUpdateRubros = ProfileService.updateProfessionalRubros;

      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });
      ProfileService.updateProfessionalRubros = async (userId, rubroIds) => ({
        rubros_asignados: rubroIds.length,
        rubro_ids: rubroIds
      });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile/rubros',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: {
            rubro_ids: ['a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d']
          }
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.equal(res.body.data.rubros_asignados, 1);
      } finally {
        supabase.auth.getUser = originalGetUser;
        ProfileService.updateProfessionalRubros = originalUpdateRubros;
      }
    });

    test('PUT /api/v1/professional-profile/zones: Asigna zonas y finaliza onboarding', async () => {
      const originalGetUser = supabase.auth.getUser;
      const originalUpdateZones = ProfileService.updateProfessionalZones;

      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });
      ProfileService.updateProfessionalZones = async (userId, zoneIds) => ({
        zonas_asignadas: zoneIds.length,
        zone_ids: zoneIds,
        onboarding_completo: true
      });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/professional-profile/zones',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: {
            zone_ids: ['b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e']
          }
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.equal(res.body.data.onboarding_completo, true);
        assert.equal(res.body.data.redirect_url, '/dashboard/feed');
      } finally {
        supabase.auth.getUser = originalGetUser;
        ProfileService.updateProfessionalZones = originalUpdateZones;
      }
    });

    test('GET /api/v1/professionals/:id: Retorna perfil público sin datos privados', async () => {
      const originalGetUser = supabase.auth.getUser;
      const originalGetPublic = ProfileService.getPublicProfessionalProfile;

      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });
      ProfileService.getPublicProfessionalProfile = async (id) => ({
        id,
        nombre: 'Esteban',
        apellido_inicial: 'M.',
        nombre_completo_publico: 'Esteban M.',
        avatar_url: 'https://supabase.co/storage/v1/object/public/avatares/esteban.jpg',
        descripcion: 'Técnico electricista matriculado en CABA.',
        calificacion_promedio: 4.9,
        total_resenas: 25,
        etiquetas: ['Electricista', 'Matriculado'],
        radio_cobertura_km: 15,
        ubicacion_referencial: { barrio_localidad: 'Caballito', provincia: 'CABA' },
        matricula: { tiene_matricula: true, organismo_emisor: 'COPIME' },
        rubros: [{ id: 'rubro-1', nombre: 'Electricista' }],
        zonas: [{ id: 'zone-1', name: 'Caballito' }],
        resenas_recientes: []
      });

      try {
        const res = await simulateRequest(app, {
          method: 'GET',
          path: '/api/v1/professionals/prof-123',
          headers: { Authorization: 'Bearer mock-valid-jwt' }
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
        assert.equal(res.body.data.nombre_completo_publico, 'Esteban M.');
        assert.equal(res.body.data.telefono, undefined);
        assert.equal(res.body.data.email, undefined);
        assert.equal(res.body.data.dni, undefined);
        assert.equal(res.body.data.cuit_cuil, undefined);
      } finally {
        supabase.auth.getUser = originalGetUser;
        ProfileService.getPublicProfessionalProfile = originalGetPublic;
      }
    });

    test('Soporte de Alias en Español (/api/v1/perfil-profesional/paso1 y paso2)', async () => {
      const originalGetUser = supabase.auth.getUser;
      const originalUpdateProf = ProfileService.updateProfessionalProfile;

      supabase.auth.getUser = async () => ({ data: { user: mockAuthUser }, error: null });
      ProfileService.updateProfessionalProfile = async (userId, data) => ({
        id: 'prof-id-alias',
        usuario_id: userId,
        descripcion: data.descripcion,
        paso1_completo: true
      });

      try {
        const res = await simulateRequest(app, {
          method: 'PUT',
          path: '/api/v1/perfil-profesional/paso1',
          headers: { Authorization: 'Bearer mock-valid-jwt' },
          body: {
            descripcion: 'Descripción completa para el paso 1 del wizard de onboarding.'
          }
        });

        assert.equal(res.status, 200);
        assert.equal(res.body.status, 'success');
      } finally {
        supabase.auth.getUser = originalGetUser;
        ProfileService.updateProfessionalProfile = originalUpdateProf;
      }
    });
  });
});
