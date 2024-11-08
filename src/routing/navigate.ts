import type { DynamicRoute, RouteKeys, routes } from "./routes";
import * as v from "valibot";
import { navigate as astroNavigate } from "astro:transitions/client";
import { href } from "./href";

export function navigate<RouteKey extends RouteKeys>(
  routeKey: RouteKey,
  params: (typeof routes)[RouteKey] extends DynamicRoute
    ? v.InferOutput<(typeof routes)[RouteKey]["paramsSchema"]>
    : undefined,
) {
  return astroNavigate(href(routeKey, params));
}
