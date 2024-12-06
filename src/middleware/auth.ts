import type { Role } from "@/auth/domain.ts";
import invariant from "@/invariant.ts";
import { checkAccess } from "@/routing/access.ts";
import { href } from "@/routing/href.ts";
import { findRouteByPath, type RouteKeys } from '@/routing/routes.ts';
import type { APIContext } from "astro";
import "@total-typescript/ts-reset";

const staticRouteKeys: string[] = ["코치-소개"] satisfies RouteKeys[];
export async function onAuth(
  context: APIContext,
  next: () => Promise<Response>,
) {
  const user = context.locals.user;

  if (
    context.url.pathname.startsWith("/api")
    || context.url.pathname.startsWith("/_actions")
    || context.url.pathname === "/favicon.ico"
    || context.url.pathname === "/sitemap.xml"
    || context.url.pathname === "/og.png"
    || context.url.pathname === "/robots.txt"
    || context.url.pathname === "/403"
    || context.url.pathname === "/404"
  ) {
    return next();
  }

  const route = findRouteByPath(context.url.pathname);

  if (route === undefined){
    console.warn(context.url.pathname)
    return;
  }

  if (staticRouteKeys.includes(route.key)) {
    return next();
  }

  const accessCheckResult = checkAccess({
    path: context.url.pathname,
    isLoggedIn: user !== undefined,
    role: user?.role as Role | undefined,
  });

  if (accessCheckResult === "need-login") {
    return context.redirect(href("로그인", {}));
  }

  if (accessCheckResult === "not-authorized") {
    return context.redirect("/403");
  }

  invariant(accessCheckResult === "can-access", "접근 가능해야 합니다");

  return next();
}
