import * as v from "valibot";
import invariant from "@/invariant.ts";
import { resolveRoute, type RouteKeys, type RouteParams } from "./routes.ts";

export function parseRouteParamsFromUrl<RouteKey extends RouteKeys>(
  routeKey: RouteKey,
  url: URL,
): RouteParams<RouteKey> {
  const route = resolveRoute(routeKey);

  const searchParams = Object.fromEntries(new URLSearchParams(url.search));

  if ("paramsSchema" in route) {
    const pathKeys = [];

    const regex = /\[([^/]+)\]/;
    let current = regex.exec(route.path);
    while (current) {
      pathKeys.push(current[1]);
      current = regex.exec(url.pathname);
    }

    const pathValues = new RegExp(
      route.path.replaceAll(/\[[^/]+\]/g, "([^/]+)"),
    )
      .exec(url.pathname)
      ?.slice(1);

    if (pathValues === undefined || pathValues.length === 0) {
      const result = v.safeParse(route.paramsSchema, searchParams);
      invariant(
        result.success,
        "잘못된 파라미터입니다!\n" +
          routeKey +
          "\n\n" +
          JSON.stringify(searchParams),
      );
      return result.output as RouteParams<RouteKey>;
    }

    const pathParams = Object.fromEntries(
      pathKeys.map((path, index) => {
        return [path, pathValues[index]];
      }),
    );

    const result = v.safeParse(route.paramsSchema, {
      ...pathParams,
      ...searchParams,
    });

    invariant(
      result.success,
      "잘못된 파라미터입니다!\n" +
        routeKey +
        "\n\n" +
        JSON.stringify(searchParams),
    );

    return result.output as RouteParams<RouteKey>;
  }

  return undefined as RouteParams<RouteKey>;
}

export function getParsedParams<RouteKey extends RouteKeys>(
  routeKey: RouteKey,
): RouteParams<RouteKey> {
  return parseRouteParamsFromUrl(routeKey, new URL(window.location.href));
}
