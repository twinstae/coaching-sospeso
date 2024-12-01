import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/adapters/db.ts";
import { plunkEmailApi, fakeEmailApi } from "@/adapters/emailApi.ts";
import { secretEnv } from "@/adapters/env.secret";
import { renderSecretLinkEmail } from "@/adapters/renderEmail";
import { isProd } from '@/adapters/env.public';

const emailApi = isProd ? plunkEmailApi : fakeEmailApi;
const LIFE_LIFTER_ADMIN_EMAIL = "taehee.kim@life-lifter.com";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  session: {
    cookieCache: {
        enabled: true,
        maxAge: 5 * 60 // Cache duration in seconds
    }
  },
  socialProviders: {
    google: {
      clientId: secretEnv.GOOGLE_CLIENT_ID as string,
      clientSecret: secretEnv.GOOGLE_CLIENT_SECRET as string,
    },
    twitter: {
      clientId: secretEnv.TWITTER_CLIENT_ID,
      clientSecret: secretEnv.TWITTER_CLIENT_SECRET,
    },
    github: {
      clientId: secretEnv.GITHUB_CLIENT_ID,
      clientSecret: secretEnv.GITHUB_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      nickname: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: true,
      },
      phone: {
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
        subject: "코칭 소스페소 비밀번호 변경하기",
        html: await renderSecretLinkEmail({
          title: `비밀번호 변경`,
          description: "비밀번호를 변경하시려면 다음 링크를 클릭해주세요.",
          cta: {
            href: url,
            text: "비밀번호 변경하기",
          },
        }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      emailApi.send({
        to: user.email,
        from: LIFE_LIFTER_ADMIN_EMAIL,
        subject: "코칭 소스페소에 가입하기",
        html: await renderSecretLinkEmail({
          title: `${user.name} 님 어서오세요`,
          description:
            "가입을 완료하시려면 다음 링크를 눌러 이메일을 인증해주세요",
          cta: {
            href: url,
            text: "이메일 인증하기",
          },
        }),
      });
    },
  },
});
