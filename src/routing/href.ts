import * as v from "valibot";
import { resolveRoute, type RouteKeys, type RouteParams } from "./routes";

export function href<RouteKey extends RouteKeys>(
  routeKey: RouteKey,
  params: RouteParams<RouteKey>,
) {
  const route = resolveRoute(routeKey);

  if ("paramsSchema" in route) {
    try {
      const parsedParams = v.parse(route.paramsSchema, params);

      const searchParams = new URLSearchParams();

      const result = Object.entries(parsedParams).reduce(
        (path, [key, value]) => {
          if (new RegExp("\\[" + key + "\\]").exec(path)) {
            return path.replace("[" + key + "]", encodeURIComponent(value));
          }

          if (value !== undefined) {
            searchParams.set(key, encodeURIComponent(value));
          }
          return path;
        },
        route.path,
      );

      return (
        result + (searchParams.size > 0 ? "?" + searchParams.toString() : "")
      );
    } catch (error) {
      throw new Error("[invalid route params] " + (error as Error).message);
    }
  }
  return route.path;
}
