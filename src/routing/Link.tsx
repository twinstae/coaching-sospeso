import type { ComponentProps } from "react";
import type { RouteKeys, RouteParams } from "./routes.ts";
import { href } from "./href.ts";

export function Link<RouteKey extends RouteKeys>({
  routeKey,
  params,
  ...props
}: {
  routeKey: RouteKey;
  params: RouteParams<RouteKey>;
} & Omit<ComponentProps<"a">, "href">) {
  return <a {...props} href={href(routeKey, params)}></a>;
}
