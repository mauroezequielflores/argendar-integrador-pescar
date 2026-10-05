import { supabase } from '../config/supabase.js';
import { AppError } from '../utils/errors.js';
import { fullName, fetchProfileNames, resolvePaymentParties } from '../utils/adminLookups.js';

const TIMEZONE = 'America/Argentina/Buenos_Aires';
const DAY_MS = 24 * 60 * 60 * 1000;
const PERIOD_DAYS = { '7days': 7, '30days': 30 };
const TREND_BUCKETS = 4;
const ALL_TIME_TREND_DAYS = 28;
const ACTIVE_REQUEST_STATUSES = ['open', 'offered'];
const PAGE_SIZE = 1000;
const MAX_PAGES = 10;

const ROLE_LABELS = { client: 'cliente', professional: 'profesional', administrator: 'administrador' };
const PAYMENT_STATUS_LABELS = { pending: 'pendiente', partial: 'parcial', paid: 'pagado', refunded: 'reembolsado' };

// Definición de cada KPI: tabla, filtro de estado y si respeta el filtro `period`.
const METRICS = {
  totalUsers: { table: 'profiles', filter: { excludeStatus: 'deleted' }, usesPeriod: true },
  activeRequests: { table: 'requests', filter: { statuses: ACTIVE_REQUEST_STATUSES }, usesPeriod: false },
  totalOffers: { table: 'offers', filter: {}, usesPeriod: true },
  totalTransactions: { table: 'payments', filter: { statuses: ['paid'] }, usesPeriod: true }
};

const dayKeyFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: TIMEZONE, year: 'numeric', month: '2-digit', day: '2-digit'
});
const dayKey = (date) => dayKeyFormatter.format(date);

const fail = (label, error) => {
  console.error(`AdminDashboardService ${label}:`, error);
  throw new AppError('Error al obtener los datos del dashboard', 500);
};

const countRows = async (table, { statuses, excludeStatus, from, to } = {}) => {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });
  if (statuses) query = query.in('status', statuses);
  if (excludeStatus) query = query.neq('status', excludeStatus);
  if (from) query = query.gte('created_at', from.toISOString());
  if (to) query = query.lt('created_at', to.toISOString());

  const { count, error } = await query;
  if (error) fail(`count ${table}`, error);
  return count ?? 0;
};

// Trae todas las fechas de creación desde `since` paginando (Supabase limita a 1000 filas por request).
const fetchCreatedAt = async (table, since) => {
  const dates = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { data, error } = await supabase
      .from(table)
      .select('created_at')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    if (error) fail(`created_at ${table}`, error);
    dates.push(...data.map((row) => row.created_at));
    if (data.length < PAGE_SIZE) break;
  }
  return dates;
};

export const getMetrics = async (period = 'all_time') => {
  const now = new Date();
  const periodDays = PERIOD_DAYS[period] ?? null;
  const periodStart = periodDays ? new Date(now.getTime() - periodDays * DAY_MS) : null;

  // Las barritas de tendencia dividen el periodo (o los últimos 28 días en all_time) en 4 tramos.
  const trendDays = periodDays ?? ALL_TIME_TREND_DAYS;
  const trendStart = now.getTime() - trendDays * DAY_MS;
  const bucketMs = (trendDays * DAY_MS) / TREND_BUCKETS;
  const buckets = Array.from({ length: TREND_BUCKETS }, (_, i) => ({
    from: new Date(trendStart + i * bucketMs),
    to: new Date(i === TREND_BUCKETS - 1 ? now.getTime() + 1 : trendStart + (i + 1) * bucketMs)
  }));

  const entries = await Promise.all(
    Object.entries(METRICS).map(async ([key, { table, filter, usesPeriod }]) => {
      const [value, trend] = await Promise.all([
        countRows(table, { ...filter, from: usesPeriod ? periodStart : null }),
        Promise.all(buckets.map((bucket) => countRows(table, { ...filter, ...bucket })))
      ]);
      return [key, { value, trend }];
    })
  );

  return { period, ...Object.fromEntries(entries) };
};

export const getActivityChart = async (days = 30) => {
  const now = new Date();
  const since = new Date(now.getTime() - days * DAY_MS);

  const [requests, offers, payments] = await Promise.all([
    fetchCreatedAt('requests', since),
    fetchCreatedAt('offers', since),
    fetchCreatedAt('payments', since)
  ]);

  // Se devuelven todos los días del rango, con 0 si no hubo actividad.
  const totals = new Map();
  for (let i = days - 1; i >= 0; i -= 1) {
    totals.set(dayKey(new Date(now.getTime() - i * DAY_MS)), 0);
  }
  [...requests, ...offers, ...payments].forEach((createdAt) => {
    const key = dayKey(new Date(createdAt));
    if (totals.has(key)) totals.set(key, totals.get(key) + 1);
  });

  return {
    days,
    points: [...totals].map(([date, total]) => ({ date, total }))
  };
};

export const getRecentActivity = async (limit = 10) => {
  const recent = (table, columns) =>
    supabase.from(table).select(columns).order('created_at', { ascending: false }).limit(limit);

  const [users, requests, offers, payments] = await Promise.all([
    recent('profiles', 'id, first_name, last_name, role, created_at').neq('status', 'deleted'),
    recent('requests', 'id, title, client_id, created_at'),
    recent('offers', 'id, professional_id, created_at'),
    recent('payments', 'id, appointment_id, total_amount, status, created_at')
  ]);

  [['profiles', users], ['requests', requests], ['offers', offers], ['payments', payments]]
    .forEach(([label, result]) => { if (result.error) fail(`recent ${label}`, result.error); });

  const parties = await resolvePaymentParties(payments.data);
  const payerByPayment = Object.fromEntries(
    Object.entries(parties).map(([paymentId, party]) => [paymentId, party.clientId])
  );
  const names = await fetchProfileNames([
    ...requests.data.map((row) => row.client_id),
    ...offers.data.map((row) => row.professional_id),
    ...Object.values(payerByPayment)
  ]);
  const actorOf = (id, role) => (id && names[id] ? { name: names[id], role } : null);

  const events = [
    ...users.data.map((row) => ({
      id: row.id,
      action: 'NUEVO_USUARIO',
      description: `Se registró ${fullName(row)} como ${ROLE_LABELS[row.role] ?? row.role}.`,
      actor: { name: fullName(row), role: row.role },
      createdAt: row.created_at
    })),
    ...requests.data.map((row) => ({
      id: row.id,
      action: 'SOLICITUD_PUBLICADA',
      description: `${names[row.client_id] ?? 'Un cliente'} publicó la solicitud "${row.title}".`,
      actor: actorOf(row.client_id, 'client'),
      createdAt: row.created_at
    })),
    ...offers.data.map((row) => ({
      id: row.id,
      action: 'OFERTA_ENVIADA',
      description: `${names[row.professional_id] ?? 'Un profesional'} envió una oferta.`,
      actor: actorOf(row.professional_id, 'professional'),
      createdAt: row.created_at
    })),
    ...payments.data.map((row) => ({
      id: row.id,
      action: 'PAGO_REGISTRADO',
      description: `Se registró un pago de $${Number(row.total_amount).toLocaleString('es-AR')} (${PAYMENT_STATUS_LABELS[row.status] ?? row.status}).`,
      actor: actorOf(payerByPayment[row.id], 'client'),
      status: row.status,
      createdAt: row.created_at
    }))
  ];

  return events
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};
