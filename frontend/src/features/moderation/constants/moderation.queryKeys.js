export const moderationKeys = {
  all: ['moderation'],
  lists: () => [...moderationKeys.all, 'list'],
  list: (entity, filtros) => [...moderationKeys.lists(), entity, filtros],
};
