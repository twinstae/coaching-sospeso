import { env } from "./env";

export type EmailT = {
  from: string;
  to: string;
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

export const plunkEmailApi = {
  send: async (email) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + env.PLUNK_EMAIL_API_KEY,
      },
      body: JSON.stringify({
        name: "코칭 소스페소",
        from: email.from,
        to: email.to,
        subject: email.subject,
        body: email.html,
        // subscribed: true,
        // reply: "<string>",
        headers: {},
      }),
    };

    fetch(
      "https://api.useplunk.com/v1/send",
      options,
    ).then((response) => response.json())
     .then((result) => {
      console.log("plunk send result: ", result);
     }).catch(error => {
      console.error(error)
     });
  },
} satisfies EmailApiI;

export const fakeEmailApi = {
  send: async (email) => {
    console.log("send", email);
    const inbox = fakeEmailInbox[email.to];
    if (inbox) {
      inbox.push(email);
    } else {
      fakeEmailInbox[email.to] = [email];
    }
  },
} satisfies EmailApiI;
