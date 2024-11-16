import { Resend } from "resend";
import { env } from "./env";

export type EmailT = {
  from: string;
  to: string[];
  subject: string;
  html: string;
};

export type EmailApiI = {
  send: (email: EmailT) => Promise<void>;
};

const fakeEmailInbox: Record<string, EmailT[]> = {};

export async function readInbox(
  emailAddress: string,
): Promise<EmailT[] | undefined> {
  return fakeEmailInbox[emailAddress];
}

export const resendEmailApi = {
  send: async (email) => {
    const resend = new Resend(env.RESEND_API_KEY);

    const { error } = await resend.emails.send(email);

    if (error) {
      throw error;
    }

    return undefined;
  },
} satisfies EmailApiI;

export const fakeEmailApi = {
  send: async (email) => {
    for (const to of email.to) {
      const inbox = fakeEmailInbox[to];
      if (inbox) {
        inbox.push(email);
      } else {
        fakeEmailInbox[to] = [email];
      }
    }
  },
} satisfies EmailApiI;
