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

export const fakeEmailApi = {
  send: async (email) => {
    console.log("email", email);
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
