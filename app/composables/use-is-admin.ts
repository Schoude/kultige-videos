export const useIsAdmin = async () => {
  const { data: roles } = await useFetch('/api/user-roles', {
    key: 'user-roles',
    headers: useRequestHeaders(['cookie']),
  });

  const isAdmin = computed(() => roles.value?.includes('admin') ?? false);

  return { isAdmin };
};
