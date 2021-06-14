import { extend } from "@vue/shared"
import { reactive, readonly } from "./reactive"

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        
        // 依赖收集 仅读的不需要依赖收集
        const res = Reflect.get(target, key, receiver)

        if (!isReadonly) {
            
        }

        if (shallow) {
            return res
        }

        return isReadonly ? readonly(res) : reactive(res)
    }
}

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowGet = createGetter(false, true)
const shallowReadonlyGet = createGetter(true, true)

const set = createSetter()
const readonlySet = {
    set(target, key) {
        console.warn(`cannot set key ${key} readonly`)
    }
}

function createSetter() {
    return function (target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver)
        console.log('设置值', key, value)
        return res
    }
}

export const mutableHandlers = {
    get,
    set,
}
export const shallowReactiveHandlers = {
    get: shallowGet,
    set,
}

export const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySet)
export const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
    set,
}, readonlySet)