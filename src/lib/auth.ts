import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/adapters/db.ts";
import { plunkEmailApi, fakeEmailApi } from "@/adapters/emailApi.ts";
import { env, isProd } from "@/adapters/env.ts";

const emailApi = isProd ? plunkEmailApi : fakeEmailApi;
const LIFE_LIFTER_ADMIN_EMAIL = "taehee.kim@life-lifter.com";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: env.TWITTER_CLIENT_ID,
      clientSecret: env.TWITTER_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      nickname: {
        type: "string",
        required: true,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await emailApi.send({
        to: user.email,
        from: LIFE_LIFTER_ADMIN_EMAIL,
        subject: "Reset your password",
        html: `Click the link to reset your password: <a href="${url}">비밀번호 리셋하기</a>`,
      });
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      emailApi.send({
        to: user.email,
        from: LIFE_LIFTER_ADMIN_EMAIL,
        subject: "코칭 소스페소에 가입하기",
        html: `소스페소에 가입하시려면 다음 링크를 클릭하세요 <a href="${url}">로그인하기</a>`,
      });
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({
        email,
        url,
      }: {
        email: string;
        token: string;
        url: string;
      }) => {
        emailApi.send({
          to: email,
          from: LIFE_LIFTER_ADMIN_EMAIL,
          subject: "코칭 소스페소에 로그인",
          html: `로그인하시려면 다음 링크를 클릭하세요 <a href="${url}">로그인하기</a>`,
        });
      },
    }),
  ],
});
