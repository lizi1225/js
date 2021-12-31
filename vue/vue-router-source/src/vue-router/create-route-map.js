export function createRouteMap(routes, pathMap) {
    pathMap = pathMap || Object.create(null)

    routes.forEach(route => {
        addRouteRecord(pathMap, route)
    })
    return {
        pathMap
    }
}

// 动态添加路由
function addRouteRecord(pathMap, route, parentRecord) {
    const path = parentRecord ? `${parentRecord.path}/${route.path}` : route.path
    const record = {
        path,
        name: route.name,
        component: route.component,
        parent: parentRecord,
    }
    if (!pathMap[path]) {
        pathMap[path] = record
    }

    if (route.children) {
        route.children.forEach(childRoute => {
            addRouteRecord(pathMap, childRoute, record)
        })
        
    }
}