import { isObject } from '@vue/shared'
import { mutableHandler, ReactiveFlags } from './baseHandler'

const reactiveMap = new WeakMap()

export function isReactive(value) {
    return !!(value && value[ReactiveFlags.IS_REACTIVE])
}

export const reactive = (target) => {
    if (!isObject(target)) return

    // 防止代理对象呗重复代理 第一次访问ReactiveFlags.IS_REACTIVE没值，第二次访问
    // 有值，不重复代理
    if (target[ReactiveFlags.IS_REACTIVE]) {
        return target
    }

    const existProxy = reactiveMap.get(target)
    if (existProxy) return existProxy
    const proxy = new Proxy(target, mutableHandler)
    reactiveMap.set(target, proxy)
    return proxy
}