import { createAuthClient } from "better-auth/react";
import { phoneNumberClient, magicLinkClient } from "better-auth/client/plugins";

const authClient = createAuthClient({
  plugins: [phoneNumberClient(), magicLinkClient()],
});

export type AuthApi = {
  signUp: {
    email: (command: {
      email: string;
      password: string;
      name: string;
      phone: string;
      nickname: string;
    }) => Promise<void>;
  };
  signIn: {
    magicLink: (command: { email: string }) => Promise<void>;
  };
};

export const authApi: AuthApi = {
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
  signIn: {
    async magicLink({ email }) {
      const { data, error } = await authClient.signIn.magicLink({
        email,
        callbackURL: "/",
      });
      console.log("magicLink sign in", data, error);
    },
  },
};
