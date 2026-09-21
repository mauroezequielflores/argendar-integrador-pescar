export const marketplaceKeys = {
  all: ['marketplace'],
  requests: () => [...marketplaceKeys.all, 'requests'],
  requestDetail: (id) => [...marketplaceKeys.requests(), id],
  offers: () => [...marketplaceKeys.all, 'offers'],
};
