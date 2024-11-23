import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
} from "better-auth/client/plugins";
import { href } from "@/routing/href.ts";
import type { auth } from "@/lib/auth";

const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
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
    }) => Promise<"success" | "already-exists" | "unknown-error">;
  };
  login: {
    emailPassword: (command: {
      email: string;
      password: string;
    }) => Promise<
      | "success"
      | "invalid-email-or-password"
      | "email-not-verified"
      | "unknown-error"
    >;
    google: () => Promise<"success" | "unknown-error">;
    twitter: () => Promise<"success" | "unknown-error">;
    github: () => Promise<"success" | "unknown-error">;
  };
  password: {
    sendVerificationEmail: (email: string) => Promise<void>;
    resetPassword: (newPassword: string) => Promise<void>;
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

      if (error?.message === "User with this email already exists") {
        return "already-exists";
      }
      if (error) {
        console.error(error);
        return "unknown-error";
      }

      return "success";
    },
  },
  login: {
    async emailPassword({ email, password }) {
      const { error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: href("홈", { page: 1 }),
      });

      if (error) {
        console.error(error.message);
        if (error.message === "Invalid email or password") {
          return "invalid-email-or-password";
        }

        if (error.message?.includes("Email is not verified")) {
          return "email-not-verified";
        }

        return "unknown-error";
      }

      return "success";
    },
    async google() {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: href("홈", { page: 1 }),
      });

      if (error) {
        console.error(error.message);
        return "unknown-error";
      }

      return "success";
    },
    async twitter() {
      const { error } = await authClient.signIn.social({
        provider: "twitter",
        callbackURL: href("홈", { page: 1 }),
      });

      if (error) {
        console.error(error.message);
        return "unknown-error";
      }

      return "success";
    },
    async github() {
      const { error } = await authClient.signIn.social({
        provider: "github",
        callbackURL: href("홈", { page: 1 }),
      });

      if (error) {
        console.error(error.message);
        return "unknown-error";
      }

      return "success";
    },
  },
  password: {
    sendVerificationEmail: async (email: string) => {
      const { error } = await authClient.forgetPassword({
        email,
        redirectTo: href("비밀번호-변경하기", {}),
      });

      if (error) {
        throw error;
      }
    },
    resetPassword: async (newPassword: string) => {
      const { error } = await authClient.resetPassword({
        newPassword,
      });

      if (error) {
        throw error;
      }
    },
  },
  async logout() {
    const { error } = await authClient.signOut();

    if (error) {
      throw error;
    }
  },
};
