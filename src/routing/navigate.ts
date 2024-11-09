import type { RouteKeys, RouteParams } from "./routes";
import { navigate as astroNavigate } from "astro:transitions/client";
import { href } from "./href";

export function navigate<RouteKey extends RouteKeys>(
  routeKey: RouteKey,
  params: RouteParams<RouteKey>,
) {
  return astroNavigate(href(routeKey, params));
}
