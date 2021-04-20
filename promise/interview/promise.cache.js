// 利用promise实例化立即执行的特性做请求的缓存
// 注意：缓存失效
const cacheMap = new Map()

function enableCache(target, name, descriptor) {
    const val = descriptor.value
    descriptor.value = async function (...args) {
        const cacheKey = name + JSON.stringify(args)
        if (!cacheMap.get(cacheKey)) {
            const cacheValue = Promise.resolve(val.apply(this, args)).catch(() => {
                cacheMap.set(cacheKey, null)
            })
            cacheMap.set(cacheKey, cacheValue)
        }
        return cacheMap.get(cacheKey)
    }
    return descriptor
}

class PromiseClass {
    // 装饰器
    // @enableCache
    static async getInfo() {

    }
}
PromiseClass.getInfo()
PromiseClass.getInfo()
PromiseClass.getInfo()