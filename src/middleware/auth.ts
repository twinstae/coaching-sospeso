import type { Role } from "@/auth/domain.ts";
import invariant from "@/invariant.ts";
import { checkAccess } from "@/routing/access.ts";
import { href } from "@/routing/href.ts";
import { findRouteByPath, type RouteKeys } from '@/routing/routes.ts';
import type { APIContext } from "astro";

const staticRouteKeys = ["코치-소개"] satisfies RouteKeys[];
export async function onAuth(
  context: APIContext,
  next: () => Promise<Response>,
) {
  const user = context.locals.user;

  const route = findRouteByPath(context.url.pathname);

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
