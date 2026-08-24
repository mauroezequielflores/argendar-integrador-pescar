import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarPerfilBasico,
  validarPerfilProfesional,
  validarRubros,
  validarZonas,
  validarCoordenadasBuenosAires,
  PHONE_REGEX_ARGENTINA,
  CUIT_REGEX
} from '../validations/profile.validation.js';

describe('1. Validaciones del Módulo Perfil Profesional (profile.validation.js)', () => {
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

  describe('Validación de Teléfonos Argentinos (PHONE_REGEX_ARGENTINA)', () => {
    test('Acepta formatos argentinos válidos (+54 9 11, sin 9, con guiones, etc.)', () => {
      const telefonosValidos = [
        '+54 9 11 4567-8901',
        '+5491145678901',
        '1145678901',
        '11-4567-8901',
        '011 15 4567 8901',
        '0221 4567890',
        '+54 9 351 456-7890'
      ];

      for (const tel of telefonosValidos) {
        assert.ok(PHONE_REGEX_ARGENTINA.test(tel), `Debería ser válido: ${tel}`);
      }
    });

    test('Rechaza formatos inválidos', () => {
      const telefonosInvalidos = ['123', 'abc', '1111111111111111111', '1234-5678'];
      for (const tel of telefonosInvalidos) {
        assert.ok(!PHONE_REGEX_ARGENTINA.test(tel), `Debería ser inválido: ${tel}`);
      }
    });
  });

  describe('Validación de CUIT / CUIL (CUIT_REGEX)', () => {
    test('Acepta formatos válidos con y sin guiones', () => {
      assert.ok(CUIT_REGEX.test('20-35123456-9'));
      assert.ok(CUIT_REGEX.test('27-40123456-4'));
      assert.ok(CUIT_REGEX.test('20351234569'));
    });

    test('Rechaza CUITs inválidos', () => {
      assert.ok(!CUIT_REGEX.test('12345'));
      assert.ok(!CUIT_REGEX.test('99-12345678-9'));
    });
  });

  describe('Validación de Coordenadas Geográficas (CABA y PBA)', () => {
    test('Acepta coordenadas de Obelisco (CABA) y Mar del Plata (PBA)', () => {
      assert.ok(validarCoordenadasBuenosAires(-34.6037, -58.3816)); // Obelisco CABA
      assert.ok(validarCoordenadasBuenosAires(-38.0055, -57.5562)); // Mar del Plata PBA
      assert.ok(validarCoordenadasBuenosAires(-34.9214, -57.9545)); // La Plata
    });

    test('Rechaza coordenadas fuera de Buenos Aires (Córdoba, Mendoza, etc.)', () => {
      assert.ok(!validarCoordenadasBuenosAires(-31.4201, -64.1888)); // Córdoba
      assert.ok(!validarCoordenadasBuenosAires(-32.8895, -68.8458)); // Mendoza
      assert.ok(!validarCoordenadasBuenosAires(null, null));
    });
  });

  describe('Middleware validarPerfilBasico (PUT /api/v1/profile)', () => {
    test('HU-07: Permite actualización válida con nombre, teléfono y avatar', () => {
      req.body = {
        nombre: 'Esteban',
        apellido: 'Morales',
        telefono: '+54 9 11 4567-8901',
        avatar_url: 'https://supabase.co/storage/v1/object/public/avatares/esteban.jpg'
      };

      validarPerfilBasico(req, res, next);
      assert.equal(req.nextCalled, true);
      assert.equal(res.statusCode, 200);
    });

    test('HU-07: Rechaza si el teléfono tiene formato inválido', () => {
      req.body = { telefono: '123' };

      validarPerfilBasico(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('teléfono')));
    });

    test('HU-07: Rechaza si el avatar no tiene URL HTTP válida', () => {
      req.body = { avatar_url: 'archivo-local.jpg' };

      validarPerfilBasico(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('avatar')));
    });
  });

  describe('Middleware validarPerfilProfesional (PUT /api/v1/professional-profile)', () => {
    test('HU-07: Permite perfil profesional con datos completos válidos', () => {
      req.body = {
        descripcion: 'Técnico electricista matriculado con 15 años de trayectoria profesional en CABA.',
        radio_cobertura_km: 15,
        ubicacion_base: {
          latitud: -34.6185,
          longitud: -58.4367,
          barrio_localidad: 'Caballito'
        },
        etiquetas: ['Electricista', 'Matriculado'],
        cuit_cuil: '20-35123456-9'
      };

      validarPerfilProfesional(req, res, next);
      assert.equal(req.nextCalled, true);
      assert.equal(res.statusCode, 200);
    });

    test('HU-07: Rechaza si la descripción tiene menos de 20 caracteres', () => {
      req.body = { descripcion: 'Corto' };

      validarPerfilProfesional(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('al menos 20 caracteres')));
    });

    test('HU-07: Rechaza si la descripción supera los 500 caracteres', () => {
      req.body = { descripcion: 'A'.repeat(501) };

      validarPerfilProfesional(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('no puede superar los 500')));
    });

    test('HU-07: Rechaza radio de cobertura fuera del rango (1 a 50 km)', () => {
      req.body = { radio_cobertura_km: 100 };

      validarPerfilProfesional(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('entre 1 y 50')));
    });

    test('HU-07: Rechaza ubicación base fuera de CABA y PBA', () => {
      req.body = {
        ubicacion_base: {
          latitud: -31.4201, // Córdoba
          longitud: -64.1888
        }
      };

      validarPerfilProfesional(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('dentro de CABA o Provincia')));
    });
  });

  describe('Middleware validarRubros (HU-08)', () => {
    test('Acepta arreglo con UUIDs válidos', () => {
      req.body = {
        rubro_ids: ['a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d']
      };

      validarRubros(req, res, next);
      assert.equal(req.nextCalled, true);
    });

    test('Rechaza si no se envían rubros o el arreglo está vacío', () => {
      req.body = { rubro_ids: [] };

      validarRubros(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('al menos un')));
    });

    test('Rechaza si algún identificador no es UUID', () => {
      req.body = { rubro_ids: ['id-invalido-123'] };

      validarRubros(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('ID de rubro inválido')));
    });
  });

  describe('Middleware validarZonas (HU-09)', () => {
    test('Acepta arreglo con UUIDs válidos', () => {
      req.body = {
        zone_ids: ['b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e']
      };

      validarZonas(req, res, next);
      assert.equal(req.nextCalled, true);
    });

    test('Rechaza si el arreglo de zonas está vacío', () => {
      req.body = { zone_ids: [] };

      validarZonas(req, res, next);
      assert.equal(res.statusCode, 400);
      assert.ok(res.data.errors.some(e => e.includes('al menos una')));
    });
  });
});
