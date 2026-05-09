import type { Database } from '~~/types/database.types';

export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser();

  if (user.value == null) {
    return navigateTo('/login');
  }

  const client = useSupabaseClient<Database>();
  const userId = user.value.sub;
  const { data, error } = await client.from('user_roles').select('roles (name)').eq('user_id', userId);

  if (error) {
    return navigateTo('/login');
  }

  const roleNames = data.map(r => r.roles?.name).filter(Boolean) ?? [];

  return roleNames.includes('admin') ? true : navigateTo('/login');
});
