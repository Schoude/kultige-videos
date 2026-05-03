import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    kakao: {
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      disableDefaultScope: true,
      scope: ['profile_image', 'profile_nickname'],
      mapProfileToUser: profile => ({
        email: `${profile.id}@kakao.placeholder.invalid`,
      }),
    },
  },
});
