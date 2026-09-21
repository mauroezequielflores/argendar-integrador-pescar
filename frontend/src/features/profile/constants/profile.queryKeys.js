export const profileKeys = {
  all: ['profile'],
  client: () => [...profileKeys.all, 'client'],
  professional: () => [...profileKeys.all, 'professional'],
  settings: (role) => [...profileKeys.all, 'settings', role],
  public: (id) => [...profileKeys.all, 'public', id],
};
