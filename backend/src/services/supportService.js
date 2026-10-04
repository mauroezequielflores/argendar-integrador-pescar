import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';

const formatTicketCode = (number) => `CON-${String(number).padStart(6, '0')}`;

export const createTicket = async (userId, { subject, message }) => {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert({ user_id: userId, subject: subject.trim(), message: message.trim() })
    .select('id, ticket_number, status, created_at')
    .single();

  if (error) {
    console.error('SupportService createTicket:', error);
    throw new AppError('No se pudo enviar la consulta', 500);
  }

  return {
    id: data.id,
    ticketNumber: formatTicketCode(data.ticket_number),
    status: data.status,
    createdAt: data.created_at
  };
};
