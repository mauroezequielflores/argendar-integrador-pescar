import { jest } from '@jest/globals';
import { requireRole } from '../middlewares/roleMiddleware.js';

describe('Middlewares de Seguridad (EP-AUTH)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, profile: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('requireRole', () => {
    test('debe permitir acceso si el usuario tiene el rol requerido', () => {
      req.profile = { role: 'professional' };
      const middleware = requireRole('professional', 'admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('debe bloquear con 403 si el rol no coincide', () => {
      req.profile = { role: 'client' };
      const middleware = requireRole('professional');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          message: expect.stringContaining('Acceso restringido')
        })
      );
      expect(next).not.toHaveBeenCalled();
    });
  });
});
