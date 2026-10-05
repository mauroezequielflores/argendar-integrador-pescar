export const reportsKeys = {
  all: ['reports'],
  lists: () => [...reportsKeys.all, 'list'],
  list: (filtros) => [...reportsKeys.lists(), filtros],
  details: () => [...reportsKeys.all, 'detail'],
  detail: (id) => [...reportsKeys.details(), id],
};
