export function forEachValue(obj, cb) {
    Object.entries(obj).forEach(([key, val]) => {
        cb(key, val)
    })
}