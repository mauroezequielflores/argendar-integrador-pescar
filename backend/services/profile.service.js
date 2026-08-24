import { supabaseAdmin } from '../config/supabase.js';

export class ProfileService {
  /**
   * Actualiza el perfil básico del usuario en public.profiles (HU-07)
   */
  static async updateProfile(userId, profileData) {
    if (!userId) {
      const error = new Error("Identificador de usuario no proporcionado.");
      error.status = 400;
      throw error;
    }

    const camposActualizar = {};

    if (profileData.nombre !== undefined || profileData.first_name !== undefined) {
      camposActualizar.nombre = (profileData.nombre ?? profileData.first_name).trim();
    }
    if (profileData.apellido !== undefined || profileData.last_name !== undefined) {
      camposActualizar.apellido = (profileData.apellido ?? profileData.last_name).trim();
    }
    if (profileData.telefono !== undefined) {
      camposActualizar.telefono = profileData.telefono ? profileData.telefono.trim() : null;
    }
    if (profileData.avatar_url !== undefined) {
      camposActualizar.avatar_url = profileData.avatar_url;
    }
    if (profileData.ubicacion !== undefined) {
      camposActualizar.ubicacion = profileData.ubicacion;
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(camposActualizar)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error("[ProfileService.updateProfile] Error de Supabase:", error);
      const err = new Error(error.message || "Error al actualizar el perfil básico.");
      err.status = 400;
      throw err;
    }

    return {
      id: data.id,
      rol: data.rol,
      role: data.rol,
      nombre: data.nombre,
      first_name: data.nombre,
      apellido: data.apellido,
      last_name: data.apellido,
      telefono: data.telefono,
      avatar_url: data.avatar_url,
      ubicacion: data.ubicacion,
      esta_suspendido: data.esta_suspendido,
      fecha_actualizacion: data.fecha_actualizacion
    };
  }

  /**
   * Actualiza el perfil profesional en public.professional_profiles (HU-07)
   */
  static async updateProfessionalProfile(userId, data) {
    if (!userId) {
      const error = new Error("Identificador de usuario no proporcionado.");
      error.status = 400;
      throw error;
    }

    const camposActualizar = {};

    if (data.descripcion !== undefined) {
      camposActualizar.descripcion = data.descripcion.trim();
    }

    const radio = data.radio_cobertura_km ?? data.coverage_radius;
    if (radio !== undefined && radio !== null) {
      camposActualizar.radio_cobertura_km = Number(radio);
    }

    if (data.ubicacion_base !== undefined) {
      camposActualizar.ubicacion_base = data.ubicacion_base;
    }

    const tags = data.etiquetas ?? data.tags;
    if (tags !== undefined && Array.isArray(tags)) {
      camposActualizar.etiquetas = tags.map(t => typeof t === 'string' ? t.trim() : String(t));
    }

    if (data.disponibilidad !== undefined) {
      camposActualizar.disponibilidad = data.disponibilidad;
    }

    // Datos de Matrícula Profesional
    const cuit = data.cuit_cuil ?? data.matricula?.cuit_cuil;
    if (cuit !== undefined) camposActualizar.cuit_cuil = cuit ? cuit.trim() : null;

    const matriculaNum = data.matricula_numero ?? data.matricula?.matricula_numero;
    if (matriculaNum !== undefined) camposActualizar.matricula_numero = matriculaNum ? matriculaNum.trim() : null;

    const emisor = data.organismo_emisor ?? data.matricula?.organismo_emisor;
    if (emisor !== undefined) camposActualizar.organismo_emisor = emisor ? emisor.trim() : null;

    const jurisdiccion = data.jurisdiccion ?? data.matricula?.jurisdiccion;
    if (jurisdiccion !== undefined) camposActualizar.jurisdiccion = jurisdiccion ? jurisdiccion.trim() : null;

    const categoria = data.categoria ?? data.matricula?.categoria;
    if (categoria !== undefined) camposActualizar.categoria = categoria ? categoria.trim() : null;

    const certificado = data.certificado_url ?? data.matricula?.certificado_url;
    if (certificado !== undefined) camposActualizar.certificado_url = certificado;

    // Regla de Matrícula Habilitante
    if (camposActualizar.matricula_numero || camposActualizar.organismo_emisor || data.tiene_matricula === true) {
      camposActualizar.tiene_matricula = true;
    } else if (data.tiene_matricula === false) {
      camposActualizar.tiene_matricula = false;
    }

    // Si viene paso1_completo o se guardó descripción y ubicación base
    if (data.paso1_completo !== undefined) {
      camposActualizar.paso1_completo = Boolean(data.paso1_completo);
    } else if (camposActualizar.descripcion) {
      camposActualizar.paso1_completo = true;
    }

    // Verificar si el registro existe en professional_profiles
    const { data: existente } = await supabaseAdmin
      .from('professional_profiles')
      .select('id')
      .eq('usuario_id', userId)
      .maybeSingle();

    let resultado = null;

    if (!existente) {
      const { data: nuevo, error: errorInsert } = await supabaseAdmin
        .from('professional_profiles')
        .insert({
          usuario_id: userId,
          ...camposActualizar
        })
        .select()
        .single();

      if (errorInsert) {
        console.error("[ProfileService.updateProfessionalProfile] Error al insertar:", errorInsert);
        const err = new Error(errorInsert.message || "Error al crear perfil profesional.");
        err.status = 400;
        throw err;
      }
      resultado = nuevo;
    } else {
      const { data: actualizado, error: errorUpdate } = await supabaseAdmin
        .from('professional_profiles')
        .update(camposActualizar)
        .eq('usuario_id', userId)
        .select()
        .single();

      if (errorUpdate) {
        console.error("[ProfileService.updateProfessionalProfile] Error al actualizar:", errorUpdate);
        const err = new Error(errorUpdate.message || "Error al actualizar perfil profesional.");
        err.status = 400;
        throw err;
      }
      resultado = actualizado;
    }

    // Si se enviaron datos básicos de perfil (ej. teléfono en el mismo request), actualizarlos en profiles
    if (data.telefono !== undefined || data.avatar_url !== undefined || data.nombre !== undefined) {
      await this.updateProfile(userId, {
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono,
        avatar_url: data.avatar_url,
        ubicacion: data.ubicacion_base
      }).catch(e => console.warn("[ProfileService] Nota al sincronizar perfil:", e.message));
    }

    return resultado;
  }

  /**
   * Obtiene todos los rubros habilitados en la plataforma (HU-08)
   */
  static async getRubros() {
    const { data, error } = await supabaseAdmin
      .from('rubros')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true });

    if (error) {
      console.error("[ProfileService.getRubros] Error al consultar rubros:", error);
      const err = new Error("Error al obtener la lista de rubros habilitados.");
      err.status = 500;
      throw err;
    }

    return data || [];
  }

  /**
   * Asigna rubros técnicos al profesional de manera transaccional (HU-08)
   */
  static async updateProfessionalRubros(userId, rubroIds) {
    if (!userId) {
      const error = new Error("Identificador de usuario no proporcionado.");
      error.status = 400;
      throw error;
    }

    // 1. Obtener o crear professional_profile
    let { data: profProfile } = await supabaseAdmin
      .from('professional_profiles')
      .select('id, onboarding_completo')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (!profProfile) {
      const { data: nuevo, error } = await supabaseAdmin
        .from('professional_profiles')
        .insert({ usuario_id: userId })
        .select('id, onboarding_completo')
        .single();

      if (error) throw error;
      profProfile = nuevo;
    }

    const professionalId = profProfile.id;

    // 2. Validar que los rubros existan
    const { data: rubrosExistentes, error: errRubros } = await supabaseAdmin
      .from('rubros')
      .select('id')
      .in('id', rubroIds);

    if (errRubros || !rubrosExistentes || rubrosExistentes.length === 0) {
      const error = new Error("Ninguno de los rubros proporcionados es válido.");
      error.status = 400;
      throw error;
    }

    const idsValidos = rubrosExistentes.map(r => r.id);

    // 3. Eliminar rubros previos
    await supabaseAdmin
      .from('professional_rubros')
      .delete()
      .eq('profesional_id', professionalId);

    // 4. Insertar nuevos rubros
    const nuevosRegistros = idsValidos.map(rubroId => ({
      profesional_id: professionalId,
      rubro_id: rubroId
    }));

    const { error: errInsert } = await supabaseAdmin
      .from('professional_rubros')
      .insert(nuevosRegistros);

    if (errInsert) {
      console.error("[ProfileService.updateProfessionalRubros] Error al insertar relaciones:", errInsert);
      const err = new Error("Error al asignar los rubros técnicos.");
      err.status = 500;
      throw err;
    }

    return {
      rubros_asignados: idsValidos.length,
      rubro_ids: idsValidos
    };
  }

  /**
   * Obtiene todas las zonas/barrios habilitadas (HU-09)
   */
  static async getZones() {
    const { data, error } = await supabaseAdmin
      .from('zones')
      .select('*')
      .eq('active', true)
      .order('name', { ascending: true });

    if (error) {
      console.error("[ProfileService.getZones] Error al consultar zonas:", error);
      const err = new Error("Error al obtener la lista de zonas habilitadas.");
      err.status = 500;
      throw err;
    }

    return data || [];
  }

  /**
   * Asigna zonas de cobertura y finaliza onboarding (HU-09)
   */
  static async updateProfessionalZones(userId, zoneIds, finalizarOnboarding = true) {
    if (!userId) {
      const error = new Error("Identificador de usuario no proporcionado.");
      error.status = 400;
      throw error;
    }

    // 1. Obtener professional_profile
    let { data: profProfile } = await supabaseAdmin
      .from('professional_profiles')
      .select('id')
      .eq('usuario_id', userId)
      .maybeSingle();

    if (!profProfile) {
      const { data: nuevo, error } = await supabaseAdmin
        .from('professional_profiles')
        .insert({ usuario_id: userId })
        .select('id')
        .single();
      if (error) throw error;
      profProfile = nuevo;
    }

    const professionalId = profProfile.id;

    // 2. Validar que las zonas existan
    const { data: zonasExistentes, error: errZonas } = await supabaseAdmin
      .from('zones')
      .select('id')
      .in('id', zoneIds);

    if (errZonas || !zonasExistentes || zonasExistentes.length === 0) {
      const error = new Error("Ninguna de las zonas proporcionadas es válida.");
      error.status = 400;
      throw error;
    }

    const idsValidos = zonasExistentes.map(z => z.id);

    // 3. Eliminar zonas previas
    await supabaseAdmin
      .from('professional_zones')
      .delete()
      .eq('professional_id', professionalId);

    // 4. Insertar nuevas zonas
    const nuevosRegistros = idsValidos.map(zoneId => ({
      professional_id: professionalId,
      zone_id: zoneId
    }));

    const { error: errInsert } = await supabaseAdmin
      .from('professional_zones')
      .insert(nuevosRegistros);

    if (errInsert) {
      console.error("[ProfileService.updateProfessionalZones] Error al insertar zonas:", errInsert);
      const err = new Error("Error al asignar las zonas de cobertura.");
      err.status = 500;
      throw err;
    }

    // 5. Si finalizarOnboarding = true, activar onboarding_completo
    if (finalizarOnboarding) {
      await supabaseAdmin
        .from('professional_profiles')
        .update({ onboarding_completo: true })
        .eq('id', professionalId);
    }

    return {
      zonas_asignadas: idsValidos.length,
      zone_ids: idsValidos,
      onboarding_completo: finalizarOnboarding
    };
  }

  /**
   * Consulta pública del perfil profesional con JOIN seguro (HU-10)
   * Omite estrictamente datos sensibles (teléfono, email, DNI, CUIT).
   */
  static async getPublicProfessionalProfile(profIdOrUserId) {
    if (!profIdOrUserId) {
      const error = new Error("Identificador de profesional requerido.");
      error.status = 400;
      throw error;
    }

    // Consultar registro en professional_profiles por id o por usuario_id
    const { data: profProfile, error: errProf } = await supabaseAdmin
      .from('professional_profiles')
      .select('*')
      .or(`id.eq.${profIdOrUserId},usuario_id.eq.${profIdOrUserId}`)
      .maybeSingle();

    if (errProf || !profProfile) {
      const error = new Error("Perfil profesional no encontrado.");
      error.status = 404;
      throw error;
    }

    const userId = profProfile.usuario_id;
    const profId = profProfile.id;

    // Consultar datos públicos del perfil de usuario
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')
      .select('nombre, apellido, avatar_url, fecha_creacion')
      .eq('id', userId)
      .maybeSingle();

    // Consultar rubros asignados
    const { data: profRubros } = await supabaseAdmin
      .from('professional_rubros')
      .select('rubros(id, nombre, slug, icono_url)')
      .eq('profesional_id', profId);

    const rubros = (profRubros || []).map(pr => pr.rubros).filter(Boolean);

    // Consultar zonas asignadas
    const { data: profZones } = await supabaseAdmin
      .from('professional_zones')
      .select('zones(id, name, city, province)')
      .eq('professional_id', profId);

    const zonas = (profZones || []).map(pz => pz.zones).filter(Boolean);

    // Consultar reseñas recientes
    const { data: resenasDb } = await supabaseAdmin
      .from('resenas')
      .select('id, calificacion, comentario, fecha_creacion, profiles(nombre, apellido)')
      .eq('profesional_id', profId)
      .order('fecha_creacion', { ascending: false })
      .limit(5);

    const resenasRecientes = (resenasDb || []).map(r => {
      const clienteNombre = r.profiles?.nombre
        ? `${r.profiles.nombre} ${r.profiles.apellido ? r.profiles.apellido[0] + '.' : ''}`
        : "Cliente de Argendar";

      return {
        id: r.id,
        cliente_nombre: clienteNombre,
        calificacion: r.calificacion,
        comentario: r.comentario,
        fecha: r.fecha_creacion
      };
    });

    // Formatear apellido abreviado para privacidad
    const nombre = userProfile?.nombre || "Profesional";
    const apellidoInicial = userProfile?.apellido
      ? `${userProfile.apellido.charAt(0).toUpperCase()}.`
      : "";

    // Ubicación referencial segura (sin calle ni altura exacta)
    const ubicacionBase = profProfile.ubicacion_base || {};
    const ubicacionReferencial = {
      barrio_localidad: ubicacionBase.barrio_localidad || ubicacionBase.barrio || null,
      partido_municipio: ubicacionBase.partido_municipio || ubicacionBase.comuna || null,
      provincia: ubicacionBase.provincia || "Buenos Aires"
    };

    return {
      id: profId,
      usuario_id: userId,
      nombre,
      apellido_inicial: apellidoInicial,
      nombre_completo_publico: `${nombre} ${apellidoInicial}`.trim(),
      avatar_url: userProfile?.avatar_url || null,
      descripcion: profProfile.descripcion || "",
      calificacion_promedio: Number(profProfile.calificacion_promedio || 0),
      total_resenas: Number(profProfile.total_resenas || 0),
      etiquetas: profProfile.etiquetas || [],
      radio_cobertura_km: Number(profProfile.radio_cobertura_km || 10),
      ubicacion_referencial: ubicacionReferencial,
      disponibilidad: profProfile.disponibilidad || {},
      matricula: {
        tiene_matricula: Boolean(profProfile.tiene_matricula),
        organismo_emisor: profProfile.organismo_emisor || null,
        jurisdiccion: profProfile.jurisdiccion || null,
        categoria: profProfile.categoria || null
      },
      rubros,
      zonas,
      resenas_recientes: resenasRecientes,
      miembro_desde: userProfile?.fecha_creacion || profProfile.fecha_creacion
    };
  }
}
