import { authClient } from '~~/lib/auth-client';

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);

  console.log(session.value);

  if (!session.value) {
    return navigateTo({ path: '/sign-in', query: { redirect: to.fullPath } });
  }

  if (session.value && to.path === '/sign-in') {
    return navigateTo('/');
  }
});
