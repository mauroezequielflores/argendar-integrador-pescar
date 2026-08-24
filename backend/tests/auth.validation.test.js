import {
  validarRegistro,
  validarLogin,
  validarRecuperacion
} from '../validations/auth.validation.js';

describe('Validaciones de Autenticación (auth.validation.js)', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('validarRegistro (HU-01 y HU-02)', () => {
    test('debe rechazar correo electrónico con formato inválido', () => {
      req.body = {
        email: 'correo-invalido',
        password: 'Password123',
        first_name: 'Juan',
        last_name: 'Pérez'
      };

      validarRegistro(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          errors: expect.arrayContaining([
            'El formato del correo electrónico es inválido.'
          ])
        })
      );
      expect(next).not.toHaveBeenCalled();
    });

    test('debe rechazar contraseña con menos de 8 caracteres', () => {
      req.body = {
        email: 'test@argendar.com',
        password: 'Pass1',
        first_name: 'Juan',
        last_name: 'Pérez'
      };

      validarRegistro(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringContaining('La contraseña debe tener al menos 8 caracteres')
          ])
        })
      );
    });

    test('debe rechazar contraseña sin números ni mayúsculas', () => {
      req.body = {
        email: 'test@argendar.com',
        password: 'sololetrasminusculas',
        first_name: 'Juan',
        last_name: 'Pérez'
      };

      validarRegistro(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            expect.stringContaining('La contraseña debe tener al menos 8 caracteres')
          ])
        })
      );
    });

    test('debe rechazar si falta nombre o apellido', () => {
      req.body = {
        email: 'test@argendar.com',
        password: 'Password123',
        first_name: '',
        last_name: '   '
      };

      validarRegistro(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            'El nombre es obligatorio.',
            'El apellido es obligatorio.'
          ])
        })
      );
    });

    test('debe rechazar rol no permitido', () => {
      req.body = {
        email: 'test@argendar.com',
        password: 'Password123',
        first_name: 'Juan',
        last_name: 'Pérez',
        role: 'superadmin'
      };

      validarRegistro(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            "El rol especificado debe ser 'client' o 'professional'."
          ])
        })
      );
    });

    test('debe pasar la validación y normalizar datos cuando son correctos', () => {
      req.body = {
        email: '  TEST@ARGENDAR.COM  ',
        password: 'Password123',
        first_name: '  Juan  ',
        last_name: '  Pérez  ',
        role: 'professional'
      };

      validarRegistro(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body.email).toBe('test@argendar.com');
      expect(req.body.first_name).toBe('Juan');
      expect(req.body.last_name).toBe('Pérez');
      expect(req.body.role).toBe('professional');
    });
  });

  describe('validarLogin (HU-03)', () => {
    test('debe rechazar si falta email o password', () => {
      req.body = { email: '', password: '' };

      validarLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          errors: expect.arrayContaining([
            'El correo electrónico es obligatorio.',
            'La contraseña es obligatoria.'
          ])
        })
      );
    });

    test('debe permitir continuar con credenciales completas', () => {
      req.body = { email: 'user@argendar.com', password: 'Password123' };

      validarLogin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.body.email).toBe('user@argendar.com');
    });
  });

  describe('validarRecuperacion (HU-04)', () => {
    test('debe rechazar email inválido', () => {
      req.body = { email: 'invalido' };

      validarRecuperacion(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    test('debe aceptar email válido', () => {
      req.body = { email: 'recovery@argendar.com' };

      validarRecuperacion(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
