import {
    nextTick
} from "../util"
import {
    popTarget,
    pushTarget
} from "./dep"

/**
 * 为什么封装成类 因为类容易扩展
 */
let id = 0
class Watcher {
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.user = options.user
        this.lazy = options.lazy
        this.dirty = this.lazy

        this.id = id++
        this.deps = []
        this.depsId = new Set()

        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else {
            this.getter = function () {
                let path = exprOrFn.split('.')
                let obj = vm
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }

        this.value = this.lazy ? void 0 : this.get()
    }
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    get() {
        pushTarget(this)
        const result = this.getter.call(this.vm)
        popTarget()
        return result
    }
    run() {
        const newValue = this.get()
        const oldValue = this.value
        this.value = newValue
        if(this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
    }
    update() {
        // this.get()
        if(this.lazy) {
            this.dirty = true
        }else {
          queueWatcher(this)
        }
    }
    evaluate() {
        this.value = this.get()
        this.dirty = false
    }
    depend() {
        let i = this.deps.length
        while(i--) {
            this.deps[i].depend()
        }

    }
}
let queue = []
let has = {}
let pending = false

function flushSchedulerQueue() {
    queue.forEach(watcher => {
        watcher.run();
        if(!watcher.user) {
            watcher.cb()
        }
    })
    queue = []
    has = {}
    pending = false
}

function queueWatcher(watcher) {
    const id = watcher.id
    if (has[id] == null) {
        queue.push(watcher)
        has[id] = true
    }
    if (!pending) {
        nextTick(flushSchedulerQueue)
        pending = true
    }

}


export default Watcher