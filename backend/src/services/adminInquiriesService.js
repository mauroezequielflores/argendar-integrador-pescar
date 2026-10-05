import { supabase } from '../config/supabase.js';
import { AppError, ConflictError, NotFoundError } from '../utils/errors.js';
import { ROLES } from '../utils/constants.js';
import { fetchProfileSummaries } from '../utils/adminLookups.js';
import { createNotification } from './notificationCreatorService.js';

const DEFAULT_LIMIT = 10;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Acepta "101", "000101", "CON-101" o "CON-000101".
const TICKET_NUMBER_REGEX = /^(?:con-?)?0*(\d{1,15})$/i;
const OUT_OF_RANGE_CODE = 'PGRST103';

const LIST_COLUMNS = 'id, ticket_number, user_id, subject, status, created_at';
const DETAIL_COLUMNS = `${LIST_COLUMNS}, message, reply_subject, reply_message, replied_by, replied_at`;

const HELP_ROUTE_BY_ROLE = {
  [ROLES.CLIENT]: '/client/help',
  [ROLES.PROFESSIONAL]: '/professional/help'
};

const formatTicketCode = (number) => `CON-${String(number).padStart(6, '0')}`;

const emptyPage = (page, limit) => ({ items: [], meta: { totalCount: 0, page, limit, hasMore: false } });

// Quita los caracteres con significado especial en los filtros de PostgREST.
const sanitizeSearch = (text) => text.replace(/[%,()*\\]/g, '');

const toListItem = (row, users) => ({
  id: row.id,
  ticketNumber: formatTicketCode(row.ticket_number),
  subject: row.subject,
  status: row.status,
  createdAt: row.created_at,
  user: users[row.user_id] ?? null
});

export const listInquiries = async ({ search, status, page = 1, limit = DEFAULT_LIMIT }) => {
  let query = supabase.from('support_tickets').select(LIST_COLUMNS, { count: 'exact' });

  if (status) query = query.eq('status', status);

  const term = search?.trim();
  if (term) {
    const numberMatch = term.match(TICKET_NUMBER_REGEX);
    const safeTerm = sanitizeSearch(term);
    if (UUID_REGEX.test(term)) {
      query = query.eq('id', term);
    } else if (numberMatch) {
      // Un número puede ser el de la consulta o formar parte de un asunto ("pago 2").
      query = query.or(`ticket_number.eq.${Number(numberMatch[1])},subject.ilike.%${safeTerm}%`);
    } else if (safeTerm) {
      query = query.ilike('subject', `%${safeTerm}%`);
    } else {
      return emptyPage(page, limit);
    }
  }

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  // Una página más allá de la última no es un error: simplemente no hay filas.
  if (error?.code === OUT_OF_RANGE_CODE) return emptyPage(page, limit);
  if (error) {
    console.error('AdminInquiriesService list:', error);
    throw new AppError('Error al obtener las consultas', 500);
  }

  const users = await fetchProfileSummaries(data.map((row) => row.user_id));
  return {
    items: data.map((row) => toListItem(row, users)),
    meta: { totalCount: count ?? 0, page, limit, hasMore: from + data.length < (count ?? 0) }
  };
};

// Arma el detalle completo. El email vive en Supabase Auth, por eso solo se pide acá y no en el listado.
const buildDetail = async (row) => {
  const users = await fetchProfileSummaries([row.user_id, row.replied_by]);

  let email = null;
  const { data: authData, error: authError } = await supabase.auth.admin.getUserById(row.user_id);
  if (authError) console.error('AdminInquiriesService email:', authError);
  else email = authData?.user?.email ?? null;

  return {
    ...toListItem(row, users),
    message: row.message,
    user: users[row.user_id] ? { ...users[row.user_id], email } : null,
    reply: row.reply_message
      ? {
          subject: row.reply_subject,
          message: row.reply_message,
          repliedAt: row.replied_at,
          repliedBy: users[row.replied_by]?.name ?? null
        }
      : null
  };
};

const loadTicket = async (id) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select(DETAIL_COLUMNS)
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('AdminInquiriesService load:', error);
    throw new AppError('Error al obtener la consulta', 500);
  }
  if (!data) throw new NotFoundError('Consulta no encontrada');
  return data;
};

export const getInquiry = async (id) => buildDetail(await loadTicket(id));

export const replyInquiry = async (id, { subject, message }, adminId) => {
  const ticket = await loadTicket(id);
  if (ticket.status === 'answered') {
    throw new ConflictError('Esta consulta ya fue respondida.', 'INQUIRY_ALREADY_ANSWERED');
  }

  // El filtro por status = 'open' evita que dos administradores respondan a la vez la misma consulta.
  const { data: updated, error } = await supabase
    .from('support_tickets')
    .update({
      status: 'answered',
      reply_subject: subject,
      reply_message: message,
      replied_by: adminId,
      replied_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('status', 'open')
    .select(DETAIL_COLUMNS)
    .maybeSingle();
  if (error) {
    console.error('AdminInquiriesService reply:', error);
    throw new AppError('Error al guardar la respuesta', 500);
  }
  if (!updated) throw new ConflictError('Esta consulta ya fue respondida.', 'INQUIRY_ALREADY_ANSWERED');

  // Aviso al usuario dentro de la app. Si falla no interrumpe: la respuesta ya quedó guardada.
  const users = await fetchProfileSummaries([ticket.user_id]);
  await createNotification({
    userId: ticket.user_id,
    type: 'support_reply',
    title: 'Respondimos tu consulta',
    description: subject,
    href: HELP_ROUTE_BY_ROLE[users[ticket.user_id]?.role] ?? '/client/help',
    relatedEntityId: ticket.id,
    relatedEntityType: 'support_ticket',
    metadata: { ticketNumber: formatTicketCode(ticket.ticket_number) }
  });

  return buildDetail(updated);
};
