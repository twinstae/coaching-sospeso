import * as v from "valibot";
import type { ComponentProps } from "react";
import type { DynamicRoute, RouteKeys, routes } from "./routes.ts";
import { href } from "./href.ts";

export function Link<RouteKey extends RouteKeys>({
  routeKey,
  params,
  ...props
}: {
  routeKey: RouteKey;
  params: (typeof routes)[RouteKey] extends DynamicRoute
    ? v.InferOutput<(typeof routes)[RouteKey]["paramsSchema"]>
    : undefined;
} & Omit<ComponentProps<"a">, "href">) {
  return <a {...props} href={href(routeKey, params)}></a>;
}
