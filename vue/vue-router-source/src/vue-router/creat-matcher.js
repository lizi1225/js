import { createRouteMap } from "./create-route-map"


export function createRoute(record, { path }) {
    const matched = []
    while(record) {
        matched.unshift(record)
        record = record.parent
    }

    return {
        path,
        matched,
    }
}

export const creatMatcher = (routes) => {
    // { path: '/', record: {}, path: '/about', record: {} }
    const { pathMap } = createRouteMap(routes)

    function match(location) {
        // 路由对应的匹配路由是谁 matched: [about, aboutA] this.$route.matched
        const record = pathMap[location]

        return createRoute(record, {
            path: location
        })
    }
    function addRoutes(routes) {
        return createRouteMap(routes, pathMap)
    }
    return {
        addRoutes,
        match,
    }
}