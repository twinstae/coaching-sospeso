import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  magicLinkClient,
} from "better-auth/client/plugins";
import { href } from "@/routing/href";
import type { auth } from "@/lib/auth";

const authClient = createAuthClient({
  plugins: [magicLinkClient(), inferAdditionalFields<typeof auth>()],
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
  logout: () => Promise<void>;
};

export const authApi: AuthApi = {
  async sendEmailVerification({ email }) {
    await authClient.sendVerificationEmail({
      email,
      callbackURL: href("홈", { page: 1 }), // The redirect URL after verification
    });
  },
  signUp: {
    async email({ email, password, name, nickname }) {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        nickname,
      });
      console.log("email sign up", data, error);

      if (error) {
        alert("email sign up failed" + error.message);
      }
    },
  },
  login: {
    async magicLink({ email }) {
      const { data, error } = await authClient.signIn.magicLink({
        email,
        callbackURL: "/",
      });
      console.log("magicLink sign in", data, error);

      if (error) {
        alert("magicLink sign in failed" + error.message);
      }
    },
  },
  async logout() {
    const { data, error } = await authClient.signOut();

    console.log("magicLink sign in", data, error);

    if (error) {
      alert("logout failed" + error.message);
    }
  },
};
