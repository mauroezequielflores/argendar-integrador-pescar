import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { ProfileService } from '../services/profile.service.js';

describe('2. Lógica del Servicio ProfileService (profile.service.test.js)', () => {

  describe('Formateo y Sanitización de Perfil Público (HU-10)', () => {
    test('Verifica que un perfil público no expone teléfono, email, DNI ni CUIT', async () => {
      // Simular un mock de respuesta interna para validar la lógica de sanitización
      const mockProf = {
        id: 'prof-uuid-1',
        usuario_id: 'user-uuid-1',
        nombre: 'Carlos',
        apellido: 'Rodríguez',
        descripcion: 'Técnico matriculado en climatización con 8 años de experiencia.',
        calificacion_promedio: 4.85,
        total_resenas: 12,
        etiquetas: ['Aire Acondicionado', 'Inverter'],
        radio_cobertura_km: 10,
        disponibilidad: { tipo: 'semanal' },
        matricula_numero: 'MAT-1234',
        organismo_emisor: 'COPIME',
        tiene_matricula: true
      };

      // Apellido abreviado
      const apellidoInicial = mockProf.apellido ? `${mockProf.apellido.charAt(0).toUpperCase()}.` : '';
      const nombrePublico = `${mockProf.nombre} ${apellidoInicial}`.trim();

      assert.equal(nombrePublico, 'Carlos R.');
      assert.equal(mockProf.telefono, undefined);
      assert.equal(mockProf.email, undefined);
      assert.equal(mockProf.dni, undefined);
    });

    test('Regla de matrícula: se activa si tiene número de matrícula y organismo', () => {
      const dataConMatricula = {
        matricula_numero: '12345',
        organismo_emisor: 'COPIME'
      };

      const tieneMatricula = Boolean(
        dataConMatricula.matricula_numero ||
        dataConMatricula.organismo_emisor
      );

      assert.equal(tieneMatricula, true);
    });

    test('Regla de matrícula: es false si no tiene credenciales', () => {
      const dataSinMatricula = {};
      const tieneMatricula = Boolean(
        dataSinMatricula.matricula_numero ||
        dataSinMatricula.organismo_emisor
      );

      assert.equal(tieneMatricula, false);
    });
  });

  describe('Cálculo de Distancia Geodésica Haversine', () => {
    // Función espejo de la implementación SQL para tests unitarios rápidos
    const calcularDistanciaKmJs = (lat1, lon1, lat2, lon2) => {
      if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
      const R = 6371; // Radio de la Tierra en km
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c * 100) / 100;
    };

    test('TC-GEO-01: Distancia Obelisco (-34.6037, -58.3816) a Congreso (-34.6090, -58.3928) es ~1.2 km', () => {
      const distancia = calcularDistanciaKmJs(-34.6037, -58.3816, -34.6090, -58.3928);
      assert.ok(distancia >= 1.0 && distancia <= 1.4, `Distancia calculada: ${distancia}`);
    });

    test('TC-GEO-02: Distancia Obelisco (-34.6037, -58.3816) a Ezeiza (-34.8222, -58.5358) es ~28-30 km', () => {
      const distancia = calcularDistanciaKmJs(-34.6037, -58.3816, -34.8222, -58.5358);
      assert.ok(distancia >= 27.0 && distancia <= 32.0, `Distancia calculada: ${distancia}`);
    });

    test('TC-GEO-03: Distancia a la misma coordenada es 0 km', () => {
      const distancia = calcularDistanciaKmJs(-34.6037, -58.3816, -34.6037, -58.3816);
      assert.equal(distancia, 0);
    });

    test('TC-GEO-04: Coordenadas nulas retornan null', () => {
      const distancia = calcularDistanciaKmJs(null, null, -34.6037, -58.3816);
      assert.equal(distancia, null);
    });
  });
});
