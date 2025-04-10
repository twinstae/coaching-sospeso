import { sequence } from "astro:middleware";
import { onAuth } from "./auth.ts";
import type { Role } from "@/auth/domain.ts";
import { auth } from "@/lib/auth.ts";
import { findRouteByPath, type RouteKeys } from '@/routing/routes.ts';

const staticRouteKeys: string[] = ["코치-소개"] satisfies RouteKeys[];

export const onRequest = sequence(async (context, next) => {
  context.locals.now = new Date();

  if (context.url.pathname === "/favicon.ico"
    || context.url.pathname === "/sitemap.xml"
    || context.url.pathname === "/og.png"
    || context.url.pathname === "/robots.txt"
    || context.url.pathname === "/403"
    || context.url.pathname === "/404"
  ) {
    return next();
  }

  const isApiOrActionRoute = context.url.pathname.startsWith("/api")
    || context.url.pathname.startsWith("/_actions");
  if (!isApiOrActionRoute) {

    const route = findRouteByPath(context.url.pathname);

    if (route === undefined) {
      console.warn(context.url.pathname)
      return next();
    }

    if (staticRouteKeys.includes(route.key)) {
      return next();
    }
  }

  const session = await auth.api.getSession({
    headers: context.request.headers,
  });

  if (session) {
    const user = session.user;

    context.locals.user = {
      id: user.id,
      nickname: user.nickname,
      role: user.role as Role,
    };
  }
  return next();
}, onAuth);
