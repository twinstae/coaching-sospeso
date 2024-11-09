import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { phoneNumber, magicLink } from "better-auth/plugins";
import { db } from "@/adapters/db.ts";
import { fakeEmailApi } from "@/adapters/emailApi";

const emailApi = fakeEmailApi;
const LIFE_LIFTER_ADMIN_EMAIL = "hello@lifelifter.com";
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    phoneNumber({
      sendOTP: (phoneNumber, code) => {},
    }),
    magicLink({
      sendMagicLink: async ({
        email,
        token,
        url,
      }: {
        email: string;
        token: string;
        url: string;
      }) => {
        emailApi.send({
          to: [email],
          from: LIFE_LIFTER_ADMIN_EMAIL,
          subject: "코칭 소스페소에 가입하기",
          html: `${token} ${url}`,
        });
      },
    }),
  ],
});
