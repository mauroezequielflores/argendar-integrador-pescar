import { supabase } from '../config/supabase.js';
import { AppError, ConflictError, NotFoundError } from '../utils/errors.js';
import { ROLES } from '../utils/constants.js';

const DEFAULT_LIMIT = 10;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const OUT_OF_RANGE_CODE = 'PGRST103';

const fullName = (row) => [row.first_name, row.last_name].filter(Boolean).join(' ') || 'Sin nombre';

const toUser = (row) => ({
  id: row.id,
  name: fullName(row),
  role: row.role,
  status: row.status,
  createdAt: row.created_at
});

const fail = (label, error) => {
  console.error(`AdminUsersService ${label}:`, error);
  throw new AppError('Error al procesar la solicitud de usuarios', 500);
};

export const listUsers = async ({ role, search, page = 1, limit = DEFAULT_LIMIT }) => {
  let query = supabase
    .from('profiles')
    .select('id, first_name, last_name, role, status, created_at', { count: 'exact' })
    .eq('role', role)
    .neq('status', 'deleted');

  const term = search?.trim();
  if (term) {
    if (UUID_REGEX.test(term)) {
      query = query.eq('id', term);
    } else {
      // Cada palabra debe coincidir con el nombre o el apellido ("Elena Martinez" → Elena Y Martinez).
      term.split(/\s+/).forEach((word) => {
        const safeWord = word.replace(/[%,()*\\]/g, '');
        if (safeWord) query = query.or(`first_name.ilike.%${safeWord}%,last_name.ilike.%${safeWord}%`);
      });
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
  if (error) fail('list', error);

  return {
    items: data.map(toUser),
    meta: { totalCount: count ?? 0, page, limit, hasMore: from + data.length < (count ?? 0) }
  };
};

// Carga el usuario a modificar y verifica que se pueda tocar. Un usuario eliminado se trata como inexistente.
const loadModifiableUser = async (id, requesterId) => {
  if (id === requesterId) {
    throw new ConflictError('No podés modificar tu propia cuenta.', 'SELF_MODIFICATION_NOT_ALLOWED');
  }

  const { data: target, error } = await supabase
    .from('profiles')
    .select('id, role, status')
    .eq('id', id)
    .maybeSingle();
  if (error) fail('load', error);
  if (!target || target.status === 'deleted') throw new NotFoundError('Usuario no encontrado');

  if (target.role === ROLES.ADMIN) {
    throw new ConflictError('No se pueden modificar cuentas de administrador.', 'ADMIN_ACCOUNT_PROTECTED');
  }
  return target;
};

const setStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ status })
    .eq('id', id)
    .select('id, status')
    .single();
  if (error) fail('update status', error);
  return data;
};

export const updateUserStatus = async (id, status, requesterId) => {
  const target = await loadModifiableUser(id, requesterId);
  if (target.status === status) return { id: target.id, status: target.status };
  return setStatus(id, status);
};

// Borrado lógico: la fila se conserva para no romper turnos, pagos ni reseñas.
export const deleteUser = async (id, requesterId) => {
  await loadModifiableUser(id, requesterId);
  return setStatus(id, 'deleted');
};
