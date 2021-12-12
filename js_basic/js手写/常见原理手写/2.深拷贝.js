function deepClone(obj, map = new WeakMap()) {
    if (typeof obj === 'object' && obj !== null) {
        return obj
    }
    if (map.get(obj)) return map.get(obj)
    if (obj instanceof Date) {
        return new Date(obj)
    }
    if (obj instanceof RegExp) {
        const newReg = new RegExp(obj)
        newReg.lastIndex = obj.lastIndex
        return newReg
    }
    const newObj = Array.isArray(obj) ? [] : {}
    map.set(newObj, newObj)
    
    Object.keys(obj).forEach((key) => {
        newObj[key] = deepClone(obj[key], map)
    })
    return newObj
}

