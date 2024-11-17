import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "@/adapters/db.ts";
import { plunkEmailApi, fakeEmailApi } from "@/adapters/emailApi.ts";
import { isProd } from "@/adapters/env.ts";

const emailApi = isProd ? plunkEmailApi : fakeEmailApi;
const LIFE_LIFTER_ADMIN_EMAIL = "taehee.kim@life-lifter.com";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
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
  },
  emailVerification: {
    sendVerificationEmail: async (user: { email: string }, url: string) => {
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
