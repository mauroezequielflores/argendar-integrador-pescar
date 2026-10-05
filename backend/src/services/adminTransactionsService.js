import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { ROLES } from '../utils/constants.js';
import { fetchProfileNames, resolvePaymentParties } from '../utils/adminLookups.js';

const DEFAULT_LIMIT = 10;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Acepta "126", "000126", "TRX-126" o "TRX-000126".
const TRANSACTION_NUMBER_REGEX = /^(?:trx-?)?0*(\d{1,15})$/i;
const OUT_OF_RANGE_CODE = 'PGRST103';

const formatTransactionNumber = (number) => `TRX-${String(number).padStart(6, '0')}`;

const toPerson = (id, names, role) => (id && names[id] ? { id, name: names[id], role } : null);

export const listTransactions = async ({ search, page = 1, limit = DEFAULT_LIMIT }) => {
  let query = supabase
    .from('payments')
    .select(
      'id, transaction_number, appointment_id, total_amount, deposit_amount, method, status, external_operation_id, created_at',
      { count: 'exact' }
    );

  const term = search?.trim();
  if (term) {
    const numberMatch = term.match(TRANSACTION_NUMBER_REGEX);
    if (UUID_REGEX.test(term)) {
      query = query.eq('id', term);
    } else if (numberMatch) {
      query = query.eq('transaction_number', Number(numberMatch[1]));
    } else {
      // Texto que no es ni un número de transacción ni un UUID: no puede coincidir con nada.
      return { items: [], meta: { totalCount: 0, page, limit, hasMore: false } };
    }
  }

  const from = (page - 1) * limit;
  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  // Una página más allá de la última no es un error: simplemente no hay filas.
  if (error?.code === OUT_OF_RANGE_CODE) {
    return { items: [], meta: { totalCount: 0, page, limit, hasMore: false } };
  }
  if (error) {
    console.error('AdminTransactionsService list:', error);
    throw new AppError('Error al obtener las transacciones', 500);
  }

  const parties = await resolvePaymentParties(data);
  const names = await fetchProfileNames(
    Object.values(parties).flatMap((party) => [party.clientId, party.professionalId])
  );

  const items = data.map((payment) => {
    const { clientId, professionalId } = parties[payment.id];
    return {
      id: payment.id,
      transactionNumber: formatTransactionNumber(payment.transaction_number),
      user: toPerson(clientId, names, ROLES.CLIENT),
      professional: toPerson(professionalId, names, ROLES.PROFESSIONAL),
      amount: Number(payment.total_amount),
      depositAmount: Number(payment.deposit_amount),
      method: payment.method,
      status: payment.status,
      createdAt: payment.created_at
    };
  });

  return {
    items,
    meta: { totalCount: count ?? 0, page, limit, hasMore: from + data.length < (count ?? 0) }
  };
};
