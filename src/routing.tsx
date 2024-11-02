import * as v from 'valibot';

type StaticRoute = { path: string }

type DynamicRoute = {path: string, paramsSchema: v.ObjectSchema<v.ObjectEntries, v.ErrorMessage<v.ObjectIssue> | undefined> }

type Route = StaticRoute | DynamicRoute

const routes = {
    "홈": {
        path: "/"
    },
    "소스페소-발행": {
        path: "/sospeso/issuing"
    },
    "소스페소-상세": {
        path: "/sospeso/[sospeso_id]",
        paramsSchema: v.object({
            sospeso_id: v.pipe(v.string(), v.uuid())
        })
    }
} satisfies Record<string, Route>

function resolveRoute(key: RouteKeys){
    return routes[key]
}

type RouteKeys = keyof typeof routes;

export function href<Key extends RouteKeys>(key: Key, params: (typeof routes)[Key] extends DynamicRoute ? v.InferOutput<(typeof routes)[Key]["paramsSchema"]> : undefined){
    const route = resolveRoute(key)

    if("paramsSchema" in route) {
        try {
            const parsedParams = v.parse(route.paramsSchema, params);


            return Object.entries(parsedParams).reduce((path, [key, value]) => {
                return path.replaceAll("[" + key + "]", value)
            }, route.path)
        } catch (error) {
            
            throw new Error("[invalid route params] " + (error as Error).message)
        }
    }
    return route.path
}