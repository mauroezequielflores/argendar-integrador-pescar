import { supabaseAdmin } from '../config/supabase.js';

// Catálogo enriquecido de perfiles de usuario para Argendar
const CATALOGO_USUARIOS = [
  // --- CLIENTES ---
  {
    email: 'test_permanente_cliente@argendar.com',
    password: 'Password123!',
    first_name: 'Carlos',
    last_name: 'Paz',
    role: 'client',
    is_suspended: false,
    description: 'Cliente frecuente de servicios de plomería y electricidad en CABA'
  },
  {
    email: 'cliente.sofia@argendar.com',
    password: 'Password123!',
    first_name: 'Sofía',
    last_name: 'Martínez',
    role: 'client',
    is_suspended: false,
    description: 'Propietaria residencial en Belgrano, CABA'
  },
  {
    email: 'cliente.lucas@argendar.com',
    password: 'Password123!',
    first_name: 'Lucas',
    last_name: 'Benítez',
    role: 'client',
    is_suspended: false,
    description: 'Cliente particular en Palermo, CABA'
  },
  {
    email: 'cliente.valeria@argendar.com',
    password: 'Password123!',
    first_name: 'Valeria',
    last_name: 'Rossi',
    role: 'client',
    is_suspended: false,
    description: 'Administradora de consorcios y oficinas'
  },

  // --- PROFESIONALES ACTIVOS (ONBOARDING COMPLETO) ---
  {
    email: 'pro.electricista@argendar.com',
    password: 'Password123!',
    first_name: 'Esteban',
    last_name: 'Morales',
    role: 'professional',
    is_suspended: false,
    is_onboarding_complete: true,
    average_rating: 4.90,
    specialty: 'Electricidad',
    description: 'Electricista Matriculado (COPIME). Instalaciones trifásicas, tableros y certificación.'
  },
  {
    email: 'pro.plomero@argendar.com',
    password: 'Password123!',
    first_name: 'Martín',
    last_name: 'Navarro',
    role: 'professional',
    is_suspended: false,
    is_onboarding_complete: true,
    average_rating: 4.85,
    specialty: 'Plomería y Gas',
    description: 'Gasista Matriculado y Plomería General. Termotanques, calderas y cloacas.'
  },
  {
    email: 'pro.climatizacion@argendar.com',
    password: 'Password123!',
    first_name: 'Camila',
    last_name: 'Domínguez',
    role: 'professional',
    is_suspended: false,
    is_onboarding_complete: true,
    average_rating: 5.00,
    specialty: 'Climatización',
    description: 'Técnica en Refrigeración. Mantenimiento, carga de gas e instalación de Split/Inverter.'
  },
  {
    email: 'pro.cerrajero@argendar.com',
    password: 'Password123!',
    first_name: 'Roberto',
    last_name: 'Alonso',
    role: 'professional',
    is_suspended: false,
    is_onboarding_complete: true,
    average_rating: 4.75,
    specialty: 'Cerrajería',
    description: 'Cerrajería de Urgencia 24hs, apertura de puertas blindadas y cerraduras digitales.'
  },

  // --- PROFESIONALES EN ONBOARDING PENDIENTE ---
  {
    email: 'test_permanente_profesional@argendar.com',
    password: 'Password123!',
    first_name: 'Mario',
    last_name: 'Rossi',
    role: 'professional',
    is_suspended: false,
    is_onboarding_complete: false,
    average_rating: 0.00,
    specialty: 'Mantenimiento General',
    description: 'Profesional recientemente registrado en proceso de validación documental.'
  },
  {
    email: 'pro.nuevo.pintor@argendar.com',
    password: 'Password123!',
    first_name: 'Nicolás',
    last_name: 'Funes',
    role: 'professional',
    is_suspended: false,
    is_onboarding_complete: false,
    average_rating: 0.00,
    specialty: 'Pintura y Revestimientos',
    description: 'Pintura de Interiores/Exteriores y Aplicación de Tarquini/Revestimiento Plástico.'
  },

  // --- CASOS ESPECIALES / SEGURIDAD ---
  {
    email: 'test_suspendido@argendar.com',
    password: 'Password123!',
    first_name: 'Usuario',
    last_name: 'Suspendido',
    role: 'client',
    is_suspended: true,
    description: 'Cuenta suspendida por infracción de términos y condiciones para tests de seguridad.'
  },
  {
    email: 'pro.suspendido@argendar.com',
    password: 'Password123!',
    first_name: 'Profesional',
    last_name: 'Sancionado',
    role: 'professional',
    is_suspended: true,
    is_onboarding_complete: true,
    average_rating: 2.10,
    specialty: 'Servicios Varios',
    description: 'Profesional con cuenta suspendida temporalmente por soporte.'
  },
  {
    email: 'admin.argendar@argendar.com',
    password: 'Password123!',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'admin',
    is_suspended: false,
    description: 'Administrador de la plataforma Argendar'
  }
];

async function seed() {
  console.log("=== INICIANDO IMPACTO DE USUARIOS EN SUPABASE POSTGRESQL ===");

  const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error("Error al listar usuarios en Supabase Auth:", listError);
    process.exit(1);
  }

  const existingUsers = listData.users || [];
  console.log(`Slots de usuarios disponibles en Supabase Auth: ${existingUsers.length}`);

  const resultados = [];

  for (let i = 0; i < CATALOGO_USUARIOS.length; i++) {
    const userDef = CATALOGO_USUARIOS[i];
    const targetSlot = existingUsers[i];

    if (!targetSlot) {
      console.warn(`No hay slot disponible para: ${userDef.email}`);
      continue;
    }

    const { data: updatedData, error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(
      targetSlot.id,
      {
        email: userDef.email,
        password: userDef.password,
        email_confirm: true,
        user_metadata: {
          first_name: userDef.first_name,
          last_name: userDef.last_name,
          role: userDef.role,
          is_suspended: userDef.is_suspended,
          is_onboarding_complete: userDef.is_onboarding_complete,
          average_rating: userDef.average_rating,
          specialty: userDef.specialty,
          description: userDef.description
        }
      }
    );

    if (updateErr) {
      console.error(`❌ Error actualizando usuario [${userDef.email}]:`, updateErr.message);
      continue;
    }

    resultados.push({
      id: targetSlot.id,
      email: userDef.email,
      password: userDef.password,
      rol: userDef.role,
      nombre: `${userDef.first_name} ${userDef.last_name}`,
      especialidad: userDef.specialty || 'N/A',
      onboarding: userDef.is_onboarding_complete !== undefined ? (userDef.is_onboarding_complete ? 'COMPLETO' : 'PENDIENTE') : 'N/A',
      suspendido: userDef.is_suspended ? 'SÍ' : 'NO'
    });
  }

  console.log("\n✅ IMPACTO EXITOSO EN BASE DE DATOS DE SUPABASE:");
  console.table(resultados);
}

seed();
