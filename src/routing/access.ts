import type { User } from "@/auth/domain";
import { findRouteByPath } from "./routes";
import invariant from "@/invariant";

export function checkAccess({
  path,
  isLoggedIn,
  role,
}: {
  path: string;
  isLoggedIn: boolean;
  role: User["role"] | undefined;
}): "need-login" | "not-authorized" | "can-access" {
  const route = findRouteByPath(path);

  invariant(route, "루트가 있어야 합니다");

  if (route.auth.required === false) {
    return "can-access";
  }

  if (!isLoggedIn) {
    return "need-login";
  }

  invariant(role, "로그인했는데 어떻게 role 이 없나요?");

  if (route.auth.roles.includes(role)) {
    return "can-access";
  }

  return "not-authorized";
}
