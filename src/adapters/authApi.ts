import { createAuthClient } from "better-auth/react";
import { magicLinkClient } from "better-auth/client/plugins";
import { href } from "@/routing/href";

const authClient = createAuthClient({
  plugins: [magicLinkClient()],
});

export type AuthApi = {
  sendEmailVerification: (command: { email: string }) => Promise<void>;
  signUp: {
    email: (command: {
      email: string;
      password: string;
      name: string;
      phone: string;
      nickname: string;
    }) => Promise<void>;
  };
  login: {
    magicLink: (command: { email: string }) => Promise<void>;
  };
};

export const authApi: AuthApi = {
  async sendEmailVerification({ email }) {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: href("홈", { page: 1 }), // The redirect URL after verification
    });
  },
  signUp: {
    async email({ email, password, name }) {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      });
      console.log("email sign up", data, error);
    },
  },
  login: {
    async magicLink({ email }) {
      const { data, error } = await authClient.signIn.magicLink({
        email,
        callbackURL: "/",
      });
      console.log("magicLink sign in", data, error);
    },
  },
};
