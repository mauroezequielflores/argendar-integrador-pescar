import { supabase } from '../config/supabase.js';
import { AppError, ConflictError, NotFoundError } from '../utils/errors.js';
import { fetchProfileSummaries, fetchRowsByIds, pick } from '../utils/adminLookups.js';

const DEFAULT_LIMIT = 10;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Acepta "125", "00125", "ORD-125" o "ORD-00125".
const ORDER_NUMBER_REGEX = /^(?:ord-?)?0*(\d{1,15})$/i;
const OUT_OF_RANGE_CODE = 'PGRST103';
const TIMEZONE = 'America/Argentina/Buenos_Aires';

const dateTimeFormatter = new Intl.DateTimeFormat('es-AR', {
  timeZone: TIMEZONE, day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
});

const formatOrderCode = (number) => `ORD-${String(number).padStart(5, '0')}`;
const formatMoney = (amount) => `$${Number(amount).toLocaleString('es-AR')}`;

// Cada entidad define qué columnas leer y cómo llevarlas al formato común { title, description, actorId }.
const ENTITIES = {
  requests: {
    table: 'requests',
    columns: 'id, order_number, client_id, title, description, moderation_status, created_at',
    describe: async (rows) => rows.map((row) => ({
      title: row.title,
      description: row.description,
      actorId: row.client_id
    }))
  },
  offers: {
    table: 'offers',
    columns: 'id, order_number, request_id, professional_id, amount, message, moderation_status, created_at',
    describe: async (rows) => {
      const requests = await fetchRowsByIds('requests', 'id, title', pick(rows, 'request_id'));
      const titleByRequest = Object.fromEntries(requests.map((row) => [row.id, row.title]));
      return rows.map((row) => ({
        title: `Oferta de ${formatMoney(row.amount)} para "${titleByRequest[row.request_id] ?? 'una solicitud'}"`,
        description: row.message,
        actorId: row.professional_id
      }));
    }
  },
  reviews: {
    table: 'reviews',
    columns: 'id, order_number, reviewer_id, rating, comment, moderation_status, created_at',
    describe: async (rows) => rows.map((row) => ({
      title: `Calificación ${row.rating}/5`,
      description: row.comment,
      actorId: row.reviewer_id
    }))
  },
  appointments: {
    table: 'appointments',
    columns: 'id, order_number, offer_id, scheduled_at, notes, moderation_status, created_at',
    describe: async (rows) => {
      const offers = await fetchRowsByIds('offers', 'id, request_id', pick(rows, 'offer_id'));
      const requests = await fetchRowsByIds('requests', 'id, title, client_id', pick(offers, 'request_id'));
      const requestByOffer = Object.fromEntries(offers.map((row) => [row.id, row.request_id]));
      const requestById = Object.fromEntries(requests.map((row) => [row.id, row]));
      return rows.map((row) => {
        const request = requestById[requestByOffer[row.offer_id]];
        return {
          title: request?.title ?? 'Turno',
          description: row.notes || `Turno programado para el ${dateTimeFormatter.format(new Date(row.scheduled_at))}.`,
          actorId: request?.client_id ?? null
        };
      });
    }
  }
};

const emptyPage = (page, limit) => ({ items: [], meta: { totalCount: 0, page, limit, hasMore: false } });

export const listModeration = async (entity, { search, page = 1, limit = DEFAULT_LIMIT }) => {
  const { table, columns, describe } = ENTITIES[entity];

  let query = supabase.from(table).select(columns, { count: 'exact' });

  const term = search?.trim();
  if (term) {
    const orderMatch = term.match(ORDER_NUMBER_REGEX);
    if (UUID_REGEX.test(term)) {
      query = query.eq('id', term);
    } else if (orderMatch) {
      query = query.eq('order_number', Number(orderMatch[1]));
    } else {
      // Texto que no es ni un número de orden ni un UUID: no puede coincidir con nada.
      return emptyPage(page, limit);
    }
  }

  // El administrador ve los tres estados (activo, desactivado y eliminado).
  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  // Una página más allá de la última no es un error: simplemente no hay filas.
  if (error?.code === OUT_OF_RANGE_CODE) return emptyPage(page, limit);
  if (error) {
    console.error(`AdminModerationService list ${entity}:`, error);
    throw new AppError('Error al obtener los elementos a moderar', 500);
  }

  const described = await describe(data);
  const actors = await fetchProfileSummaries(described.map((item) => item.actorId));

  return {
    items: data.map((row, index) => ({
      id: row.id,
      orderNumber: formatOrderCode(row.order_number),
      moderationStatus: row.moderation_status,
      title: described[index].title,
      description: described[index].description,
      user: actors[described[index].actorId] ?? null,
      createdAt: row.created_at
    })),
    meta: { totalCount: count ?? 0, page, limit, hasMore: from + data.length < (count ?? 0) }
  };
};

export const updateModerationStatus = async (entity, id, moderationStatus) => {
  const { table } = ENTITIES[entity];

  const { data: current, error: readError } = await supabase
    .from(table)
    .select('id, moderation_status')
    .eq('id', id)
    .maybeSingle();
  if (readError) {
    console.error(`AdminModerationService read ${entity}:`, readError);
    throw new AppError('Error al actualizar el elemento', 500);
  }
  if (!current) throw new NotFoundError('Elemento no encontrado');

  // Eliminar es definitivo: un elemento eliminado no vuelve a activarse ni desactivarse.
  if (current.moderation_status === 'deleted' && moderationStatus !== 'deleted') {
    throw new ConflictError('Un elemento eliminado no se puede restaurar.', 'ITEM_DELETED');
  }
  if (current.moderation_status === moderationStatus) return { id, moderationStatus };

  const { error: updateError } = await supabase
    .from(table)
    .update({ moderation_status: moderationStatus })
    .eq('id', id);
  if (updateError) {
    console.error(`AdminModerationService update ${entity}:`, updateError);
    throw new AppError('Error al actualizar el elemento', 500);
  }
  return { id, moderationStatus };
};
