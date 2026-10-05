export const usersKeys = {
  all: ['users'],
  lists: () => [...usersKeys.all, 'list'],
  list: (filtros) => [...usersKeys.lists(), filtros],
};
