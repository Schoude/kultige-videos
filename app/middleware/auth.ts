import { authClient } from '~~/lib/auth-client';

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (!session.value && to.path !== '/sign-in') {
    return navigateTo({ path: '/sign-in' });
  }

  if (session.value && to.path === '/sign-in') {
    return navigateTo('/');
  }
});
