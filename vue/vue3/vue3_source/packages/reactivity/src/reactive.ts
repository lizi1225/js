import { isObject } from '@vue/shared';
import { mutableHandlers, shallowReactiveHandlers, readonlyHandlers, shallowReadonlyHandlers } from './baseHandlers'
const reactiveMap = new WeakMap()

const readonlyMap = new WeakMap()

const shallowReadonlyMap = new WeakMap()
const shallowReactiveMap = new WeakMap()
export function reactive(target: object) {
    return createReactiveObject(target, mutableHandlers, reactiveMap)
}

export function shallowReactive(target: object) {
    return createReactiveObject(target, shallowReactiveHandlers, shallowReactiveMap)
}

export function readonly(target: object) {
    return createReactiveObject(target, readonlyHandlers, readonlyMap)
}

export function shallowReadonly(target: object) {
    return createReactiveObject(target, shallowReadonlyHandlers, shallowReadonlyMap)
}




export function createReactiveObject(target, baseHandlers, proxyMap) {
    if (!isObject(target)) {
        return target
    }
    // let obj = {}  reactive(obj) readonly(obj) 做缓存 不要重复代理
    // const proxyMap = isReadonly ? readonlyMap : reactiveMap
    if (proxyMap.get(target)) {
        return proxyMap.get(target)
    }
    
    const proxy = new Proxy(target, baseHandlers)
    proxyMap.set(target, proxy)
    return proxy
}