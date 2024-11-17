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
    emailPassword: (command: { email: string, password: string })
      => Promise<"success" | "invalid-email-or-password">;
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
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        nickname,
      });

      if (error) {
        throw error;
      }
    },
  },
  login: {
    async emailPassword({ email, password }) {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/"
      });


      if(error){
        if(error.message === "Invalid email or password") {
          return "invalid-email-or-password"
        }

      }

      return "success"
    },
  },
  async logout() {
    const { error } = await authClient.signOut();

    if (error) {
      throw error;
    }
  },
};
