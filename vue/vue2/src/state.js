import Dep from "./observer/dep"
import {
    observe
} from "./observer/index"
import Watcher from "./observer/watcher"
import {
    nextTick,
    proxy
} from "./util"

export function initState(vm) {
    const opts = vm.$options
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initProps() {

}

function initMethods() {

}


function initData(vm) {
    let data = vm.$options.data
    vm._data = data = typeof data === 'function' ? data.call(vm) : data

    for (let key in data) {
        proxy(vm, '_data', key)
    }

    observe(data)
}

function initComputed(vm) {
    const computed = vm.$options.computed
    // 1.需要有watcher 2、defineProperty 3、dirty lazy
    const watchers = vm._computedWatchers = {}
    for (let key in computed) {
        const userDef = computed[key]

        const getter = typeof userDef === 'function' ? userDef : userDef.get

        watchers[key] = new Watcher(vm, getter, () => {}, {lazy:true})

        defineComputed(vm, key, userDef)
    }
}
const sharedPropertyDefinition = {}

function defineComputed(target, key, userDef) {
    if (typeof userDef === 'function') {
        sharedPropertyDefinition.get = createComputedGetter(key)
    } else {
        sharedPropertyDefinition.get = createComputedGetter(key)
        sharedPropertyDefinition.set = userDef.set
    }
    Object.defineProperty(target, key, sharedPropertyDefinition)
}

function createComputedGetter(key) {
    return function() {
        const watcher = this._computedWatchers[key]
        if(watcher) {
            if(watcher.dirty) {
                watcher.evaluate()
            }
            if(Dep.target) {
                watcher.depend()
            }
            return watcher.value
        }
    }
}

function initWatch(vm) {
    const watch = vm.$options.watch
    for (let key in watch) {
        const handler = watch[key]
        if (Array.isArray(handler)) {
            handler.forEach(handle => {
                createWatcher(vm, key, handle)
            })
        } else {
            createWatcher(vm, key, handler)
        }
    }
}

function createWatcher(vm, exprOrFn, handler, options) {
    if (typeof handler === 'object' && handler != null) {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
        handler = vm[handler]
    }
    return vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
        nextTick(cb)
    }
    Vue.prototype.$watch = function (exprOrFn, cb, options) {
        const watcher = new Watcher(this, exprOrFn, cb, {
            ...options,
            user: true
        })
        if (options.immediate) {
            cb()
        }
    }
}