import type { APIContext } from "astro";

export function redirect(path: string) {
  return new Response(null, {
    status: 302,
    headers: new Headers({ Location: path }),
  });
}

export function createContext(
  url: URL,
  init: RequestInit,
  locals: Partial<{
    user?: {
      id: string;
      nickname: string;
      role: "user" | "admin";
    };
  }> = {},
): APIContext {
  return {
    url,
    request: new Request(url, init),
    locals,
    redirect,
  } as APIContext;
}

export async function responseToHTTP(response: Response) {
  const headers = Array.from(response.headers.entries())
    .map(([key, value]) => `${key}: ${value}`)
    .join("\r\n");

  const statusLine = `HTTP/1.1 ${response.status} ${response.statusText}`;
  const body = await response.text();

  return `${statusLine}\r\n${headers}\r\n\r\n${body}`;
}

export const LOCALHOST = "http:localhost:4321";
export const next = async () => new Response();
