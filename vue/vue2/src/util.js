import { callHook } from "./lifecycle"

export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key]
        },
        set(newValue) {
            vm[data][key] = newValue
        }
    })
}
export function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
        enumerable: false,
        configurable: false,
        value
    })
}

export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
]
const strats = {}
strats.components = function (parentVal, childVal) {
    const res = Object.create(parentVal)
    if(childVal) {
        for(let key in childVal) {
            res[key] = childVal[key]
        }
    }
    return res
}
// strats.data = function (parentVal, childVal) {
//     return childVal // 这里应该有合并data的策略
// }
// strats.computed = function () {

// }
// strats.watch = function () {

// }
function mergeHook(parentVal, childVal) {
    if(childVal) {
        if(parentVal){
            // concat 比push更好 childVal可能是一个数组
            /**
             * 可能是这种写法
             * Vue.mixin({
             *      created: [
             *       function(){}, function(){}]
             * })
             */
            return parentVal.concat(childVal)
        }else {
            return [childVal]
        }
    }else {
        return parentVal
    }
}
LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
export function mergeOptions(parent, child) {
    const options = {}
    // 父亲有 儿子没有
    for(let key in parent) {
        mergeField(key)
    }
    for(let key in child) {
        if(!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
     // 儿子有父亲没有
    function mergeField(key) {
        if(strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        }else {
            // todo默认合并
            if(child[key]) {
                options[key] = child[key]
            }else {
                options[key] = parent[key]
            }
        }
        
    }
    return options
}
const callbacks = []
let pending = false
function flushCallbacks() {
    while(callbacks.length) {
        const cb = callbacks.pop()
        cb()
    }
    pending = false
}
let timerFunc;
if(Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
}else if(MutationObserver) {
    const observe = new MutationObserver(flushCallbacks)
    const textNode = document.createTextNode(1)
    observe.observe(textNode, {characterData: true})
    timerFunc = () => {
        textNode.textContent = 2
    }
}else if(setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
}else {
    timerFunc = () => {
        setTimeout(flushCallbacks)
    }
}

export function nextTick(cb) {
    callbacks.push(cb)
    if(!pending) {
        pending = true
        timerFunc()
    }
}
function makMap(str) {
    const mapping = {}
    const list = str.split(',')
    for(let i = 0; i < list.length; i++) {
        mapping[list[i]] = true
    }
    return key => {
        return mapping[key]
    }
}

export const isReservedTag = makMap('a,div,img,span,p,button,input,textarea,ul,li')