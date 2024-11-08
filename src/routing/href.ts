import * as v from "valibot";
import { resolveRoute, routes, type DynamicRoute, type RouteKeys } from "./routes";


export function href<RouteKey extends RouteKeys>(
    routeKey: RouteKey,
    params: (typeof routes)[RouteKey] extends DynamicRoute
        ? v.InferOutput<(typeof routes)[RouteKey]["paramsSchema"]>
        : undefined,
) {
    const route = resolveRoute(routeKey);

    if ("paramsSchema" in route) {
        try {
            const parsedParams = v.parse(route.paramsSchema, params);

            return Object.entries(parsedParams).reduce((path, [key, value]) => {
                return path.replaceAll("[" + key + "]", value);
            }, route.path);
        } catch (error) {
            throw new Error("[invalid route params] " + (error as Error).message);
        }
    }
    return route.path;
}