/**
 * Middleware de validación para los endpoints del Perfil Profesional y Onboarding
 * Cumple con los criterios de aceptación de HU-07, HU-08, HU-09 y HU-10.
 */

// Regex para teléfonos de Argentina (acepta formatos con/sin +54, con/sin 9, con/sin 15, guiones y espacios)
// Ejemplos válidos: +54 9 11 4567-8901, 1145678901, +541145678901, 11-4567-8901, 011 15 4567 8901, 0221 4567890
export const PHONE_REGEX_ARGENTINA = /^(?:(?:\+|00)?54\s?9?\s?)?0?(?:11|[2368]\d{1,3})\s?(?:15)?[\s-]?\d{2,4}[\s-]?\d{4}$/;

// Regex para CUIT / CUIL de Argentina (11 dígitos, con o sin guiones: 20-35123456-9 o 20351234569)
export const CUIT_REGEX = /^(20|23|24|27|30|33|34)-?\d{8}-?\d{1}$/;

// Regex para validar formato UUID v4
export const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// Bounds geográficos operativos: CABA y Provincia de Buenos Aires
export const BOUNDS_OPERATIVOS = {
  lat_min: -40.5,  // Sur PBA
  lat_max: -33.0,  // Norte PBA
  lng_min: -63.5,  // Oeste PBA
  lng_max: -56.5   // Este PBA
};

/**
 * Valida si las coordenadas están dentro de CABA y Provincia de Buenos Aires
 */
export const validarCoordenadasBuenosAires = (lat, lng) => {
  if (lat == null || lng == null) return false;
  const numLat = Number(lat);
  const numLng = Number(lng);
  if (isNaN(numLat) || isNaN(numLng)) return false;
  return (
    numLat >= BOUNDS_OPERATIVOS.lat_min &&
    numLat <= BOUNDS_OPERATIVOS.lat_max &&
    numLng >= BOUNDS_OPERATIVOS.lng_min &&
    numLng <= BOUNDS_OPERATIVOS.lng_max
  );
};

/**
 * Valida actualización del perfil básico de usuario (PUT /api/v1/profile)
 */
export const validarPerfilBasico = (req, res, next) => {
  const { nombre, first_name, apellido, last_name, telefono, avatar_url, ubicacion } = req.body;
  const errores = [];

  const nombreFinal = nombre !== undefined ? nombre : first_name;
  if (nombreFinal !== undefined) {
    if (typeof nombreFinal !== 'string' || nombreFinal.trim().length === 0) {
      errores.push("El nombre no puede estar vacío.");
    }
  }

  const apellidoFinal = apellido !== undefined ? apellido : last_name;
  if (apellidoFinal !== undefined) {
    if (typeof apellidoFinal !== 'string' || apellidoFinal.trim().length === 0) {
      errores.push("El apellido no puede estar vacío.");
    }
  }

  if (telefono !== undefined && telefono !== null && telefono !== '') {
    if (typeof telefono !== 'string' || !PHONE_REGEX_ARGENTINA.test(telefono.trim())) {
      errores.push("El formato del número de teléfono es inválido para Argentina.");
    }
  }

  if (avatar_url !== undefined && avatar_url !== null && avatar_url !== '') {
    if (typeof avatar_url !== 'string' || (!avatar_url.startsWith('http://') && !avatar_url.startsWith('https://'))) {
      errores.push("La URL del avatar debe ser una URL HTTP/HTTPS válida.");
    }
  }

  if (ubicacion !== undefined && ubicacion !== null) {
    if (typeof ubicacion !== 'object') {
      errores.push("El campo ubicacion debe ser un objeto válido.");
    } else if (ubicacion.latitud != null && ubicacion.longitud != null) {
      if (!validarCoordenadasBuenosAires(ubicacion.latitud, ubicacion.longitud)) {
        errores.push("La ubicación debe encontrarse dentro de CABA o Provincia de Buenos Aires.");
      }
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Errores de validación en los datos del perfil.",
      errors: errores
    });
  }

  next();
};

/**
 * Valida actualización del perfil profesional (PUT /api/v1/professional-profile y Paso 1)
 */
export const validarPerfilProfesional = (req, res, next) => {
  const {
    descripcion,
    radio_cobertura_km,
    coverage_radius,
    ubicacion_base,
    etiquetas,
    tags,
    cuit_cuil,
    disponibilidad,
    matricula
  } = req.body;

  const errores = [];

  // Validación de descripción (HU-07: obligatorio si se envía, 20 a 500 caracteres)
  if (descripcion !== undefined && descripcion !== null) {
    if (typeof descripcion !== 'string' || descripcion.trim().length < 20) {
      errores.push("La descripción profesional debe tener al menos 20 caracteres.");
    } else if (descripcion.trim().length > 500) {
      errores.push("La descripción profesional no puede superar los 500 caracteres.");
    }
  }

  // Validación de radio de cobertura (1 a 50 km)
  const radioFinal = radio_cobertura_km !== undefined ? radio_cobertura_km : coverage_radius;
  if (radioFinal !== undefined && radioFinal !== null) {
    const radioNum = Number(radioFinal);
    if (isNaN(radioNum) || radioNum < 1 || radioNum > 50) {
      errores.push("El radio de cobertura debe ser un valor numérico entre 1 y 50 kilómetros.");
    }
  }

  // Validación de ubicación base Google Maps
  if (ubicacion_base !== undefined && ubicacion_base !== null) {
    if (typeof ubicacion_base !== 'object') {
      errores.push("El campo ubicacion_base debe ser un objeto JSON.");
    } else {
      const lat = ubicacion_base.latitud ?? ubicacion_base.lat;
      const lng = ubicacion_base.longitud ?? ubicacion_base.lng;

      if (lat != null && lng != null) {
        if (!validarCoordenadasBuenosAires(lat, lng)) {
          errores.push("La ubicación base debe estar situada dentro de CABA o Provincia de Buenos Aires.");
        }
      }
    }
  }

  // Validación de etiquetas / tags
  const tagsFinal = etiquetas !== undefined ? etiquetas : tags;
  if (tagsFinal !== undefined && tagsFinal !== null) {
    if (!Array.isArray(tagsFinal)) {
      errores.push("El campo de etiquetas debe ser un arreglo de textos.");
    } else if (tagsFinal.some(t => typeof t !== 'string' || t.trim().length === 0)) {
      errores.push("Cada etiqueta debe ser un texto no vacío.");
    }
  }

  // Validación de CUIT / CUIL
  const cuitFinal = cuit_cuil ?? matricula?.cuit_cuil;
  if (cuitFinal !== undefined && cuitFinal !== null && cuitFinal !== '') {
    if (typeof cuitFinal !== 'string' || !CUIT_REGEX.test(cuitFinal.trim())) {
      errores.push("El formato del CUIT/CUIL es inválido (debe tener 11 dígitos).");
    }
  }

  // Validación de disponibilidad
  if (disponibilidad !== undefined && disponibilidad !== null) {
    if (typeof disponibilidad !== 'object') {
      errores.push("El campo disponibilidad debe ser un objeto válido.");
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Errores de validación en los datos del perfil profesional.",
      errors: errores
    });
  }

  next();
};

/**
 * Valida la asignación de rubros (PUT /api/v1/professional-profile/rubros)
 */
export const validarRubros = (req, res, next) => {
  const rubroIds = req.body.rubro_ids || req.body.rubroIds;

  if (!rubroIds || !Array.isArray(rubroIds) || rubroIds.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Debes seleccionar al menos un (1) rubro técnico.",
      errors: ["rubro_ids debe ser un arreglo con al menos un identificador UUID válido."]
    });
  }

  const uuidInvalidos = rubroIds.filter(id => typeof id !== 'string' || !UUID_REGEX.test(id.trim()));
  if (uuidInvalidos.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Uno o más identificadores de rubro no tienen formato UUID válido.",
      errors: uuidInvalidos.map(id => `ID de rubro inválido: ${id}`)
    });
  }

  req.body.rubro_ids = rubroIds.map(id => id.trim());
  next();
};

/**
 * Valida la asignación de zonas (PUT /api/v1/professional-profile/zones)
 */
export const validarZonas = (req, res, next) => {
  const zoneIds = req.body.zone_ids || req.body.zoneIds;

  if (!zoneIds || !Array.isArray(zoneIds) || zoneIds.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "Debes seleccionar al menos una (1) zona geográfica de cobertura.",
      errors: ["Debes seleccionar al menos una (1) zona geográfica de cobertura con formato UUID válido."]
    });
  }

  const uuidInvalidos = zoneIds.filter(id => typeof id !== 'string' || !UUID_REGEX.test(id.trim()));
  if (uuidInvalidos.length > 0) {
    return res.status(400).json({
      status: "error",
      message: "Uno o más identificadores de zona no tienen formato UUID válido.",
      errors: uuidInvalidos.map(id => `ID de zona inválido: ${id}`)
    });
  }

  req.body.zone_ids = zoneIds.map(id => id.trim());
  next();
};
