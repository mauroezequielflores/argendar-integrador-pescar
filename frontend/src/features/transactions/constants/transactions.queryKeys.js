export const transactionsKeys = {
  all: ['transactions'],
  lists: () => [...transactionsKeys.all, 'list'],
  list: (filtros) => [...transactionsKeys.lists(), filtros],
};
