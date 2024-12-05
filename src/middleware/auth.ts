import type { Role } from "@/auth/domain";
import invariant from "@/invariant";
import { checkAccess } from "@/routing/access";
import { href } from "@/routing/href";
import type { APIContext } from "astro";

const staticRoutes = ["/lifelifter/coaches"] satisfies string[];
export async function onAuth(
  context: APIContext,
  next: () => Promise<Response>,
) {
  const user = context.locals.user;

  if (staticRoutes.includes(context.url.pathname)) {
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
