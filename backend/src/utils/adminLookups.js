import { supabase } from '../config/supabase.js';
import { AppError } from './errors.js';

export const pick = (rows, key) => [...new Set((rows ?? []).map((row) => row[key]).filter(Boolean))];

export const fullName = (profile, fallback = 'Un usuario') =>
  [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || fallback;

// Devuelve { [profileId]: "Nombre Apellido" } para los ids indicados.
export const fetchProfileNames = async (ids) => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return {};

  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name')
    .in('id', uniqueIds);
  if (error) {
    console.error('adminLookups names:', error);
    throw new AppError('Error al obtener los nombres de usuario', 500);
  }
  return Object.fromEntries(data.map((profile) => [profile.id, fullName(profile)]));
};

// Devuelve { [profileId]: { id, name, role } } para los ids indicados.
export const fetchProfileSummaries = async (ids) => {
  const uniqueIds = [...new Set(ids.filter(Boolean))];
  if (uniqueIds.length === 0) return {};

  const { data, error } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role')
    .in('id', uniqueIds);
  if (error) {
    console.error('adminLookups summaries:', error);
    throw new AppError('Error al obtener los datos de usuario', 500);
  }
  return Object.fromEntries(
    data.map((profile) => [profile.id, { id: profile.id, name: fullName(profile), role: profile.role }])
  );
};

// Es un dato de enriquecimiento: si una consulta falla, devuelve [] y el registro queda sin esos datos.
export const fetchRowsByIds = async (table, columns, ids) => {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from(table).select(columns).in('id', ids);
  if (error) {
    console.error(`adminLookups ${table}:`, error);
    return [];
  }
  return data;
};

// Averigua quiénes participan en cada pago (payments → appointments → offers → requests).
// Devuelve { [paymentId]: { clientId, professionalId } }.
export const resolvePaymentParties = async (payments) => {
  const appointments = await fetchRowsByIds('appointments', 'id, offer_id', pick(payments, 'appointment_id'));
  const offers = await fetchRowsByIds('offers', 'id, request_id, professional_id', pick(appointments, 'offer_id'));
  const requests = await fetchRowsByIds('requests', 'id, client_id', pick(offers, 'request_id'));

  const clientByRequest = Object.fromEntries(requests.map((row) => [row.id, row.client_id]));
  const offerById = Object.fromEntries(offers.map((row) => [row.id, row]));
  const offerByAppointment = Object.fromEntries(appointments.map((row) => [row.id, row.offer_id]));

  return Object.fromEntries(
    payments.map((payment) => {
      const offer = offerById[offerByAppointment[payment.appointment_id]];
      return [
        payment.id,
        {
          clientId: clientByRequest[offer?.request_id] ?? null,
          professionalId: offer?.professional_id ?? null
        }
      ];
    })
  );
};
