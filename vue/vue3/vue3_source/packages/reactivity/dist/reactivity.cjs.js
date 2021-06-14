'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const isObject = (val) => typeof val === 'object' && val !== null;
const extend = Object.assign;

function createGetter(isReadonly = false, shallow = false) {
    return function get(target, key, receiver) {
        // 依赖收集 仅读的不需要依赖收集
        const res = Reflect.get(target, key, receiver);
        if (shallow) {
            return res;
        }
        return isReadonly ? readonly(res) : reactive(res);
    };
}
const get = createGetter();
const readonlyGet = createGetter(true);
const shallowGet = createGetter(false, true);
const shallowReadonlyGet = createGetter(true, true);
const set = createSetter();
const readonlySet = {
    set(target, key) {
        console.warn(`cannot set key ${key} readonly`);
    }
};
function createSetter() {
    return function (target, key, value, receiver) {
        const res = Reflect.set(target, key, value, receiver);
        console.log('设置值', key, value);
        return res;
    };
}
const mutableHandlers = {
    get,
    set,
};
const shallowReactiveHandlers = {
    get: shallowGet,
    set,
};
const readonlyHandlers = extend({
    get: readonlyGet,
}, readonlySet);
const shallowReadonlyHandlers = extend({
    get: shallowReadonlyGet,
    set,
}, readonlySet);

const reactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
function reactive(target) {
    return createReactiveObject(target, mutableHandlers, reactiveMap);
}
function shallowReactive(target) {
    return createReactiveObject(target, shallowReactiveHandlers, shallowReactiveMap);
}
function readonly(target) {
    return createReactiveObject(target, readonlyHandlers, readonlyMap);
}
function shallowReadonly(target) {
    return createReactiveObject(target, shallowReadonlyHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, baseHandlers, proxyMap) {
    if (!isObject(target)) {
        return target;
    }
    // let obj = {}  reactive(obj) readonly(obj) 做缓存 不要重复代理
    // const proxyMap = isReadonly ? readonlyMap : reactiveMap
    if (proxyMap.get(target)) {
        return proxyMap.get(target);
    }
    const proxy = new Proxy(target, baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
}

exports.reactive = reactive;
exports.readonly = readonly;
exports.shallowReactive = shallowReactive;
exports.shallowReadonly = shallowReadonly;
//# sourceMappingURL=reactivity.cjs.js.map
