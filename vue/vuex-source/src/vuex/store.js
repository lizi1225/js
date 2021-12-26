import {
    Vue
} from './install'
import ModuleCollection from './module/module-collection'
import { forEachValue } from './utils'


function getState(store, path) {
    return path.reduce((prev, cur) => prev[cur], store.state)
}
function installModule(store, path, module, rootState) {

    const namespace = store.modules.getNamespace(path)

    if (path.length > 0) {
        const parent = path.slice(0, -1).reduce((prev, cur) => {
            return prev[cur]
        }, rootState)
        // parent[path[path.length - 1]] = module.state
        Vue.set(parent, path[path.length - 1], module.state)
    }

    module.forEachMutation((key, val) => {
        store.mutations[namespace + key] = (store.mutations[namespace + key] || [])
        store.mutations[namespace + key].push((payload) => {
            val(getState(store, path),payload)
            store._subscribes.forEach((cb) => cb({ type: key }), store.state)
        })
    })
    module.forEachAction((key, val) => {
        store.actions[namespace + key] = (store.actions[namespace + key] || [])
        store.actions[namespace + key].push((payload) => {
            val(store, payload)
        })
    })

    module.forEachGetter((key, val) => {
        if (store.wrapperGetters[namespace + key]) {
            return console.error('getters key duplicate')
        }
        store.wrapperGetters[namespace + key] = () => {
            return val(getState(store, path))
        }
    }) 
    module.forEachChildren((key, val) => {
        installModule(store, path.concat(key), val, rootState)
    })

    
}

function resetVM(store, state) {
    const oldVM = store.vm
    const computed = {}
    store.getters = {}
    forEachValue(store.wrapperGetters, (key, val) => {
        computed[key] = () => val.call(store, state)
        Object.defineProperty(store.getters, key, {
            get() {
                return store.vm[key]
            }
        })
    })

    store.vm = new Vue({
        data: {
            $$store: state,
        },
        computed,
    })
    if (oldVM) {
        Vue.nextTick(() => oldVM.$destroy())
    }
}

class Store {
    constructor(options) {
        this.modules = new ModuleCollection(options)
        
        this.actions = {}
        this.mutations = {}
        this.wrapperGetters = {}

        this._subscribes = []

        const state = options.state
        installModule(this, [], this.modules.root, state)
        
        resetVM(this, state)

        if (Array.isArray(options.plugins) && options.plugins.length) {
            options.plugins.forEach((plugin) => plugin(this))
        }
        
    }
    commit = (key, payload) => {
        const mutations = this.mutations[key]
        if (mutations) {
            mutations.forEach((fn) => fn(payload))
        }
    }
    dispatch = (key, payload) => {
        const actions = this.actions[key]
        if (actions) {
            actions.forEach((fn) => fn(payload))
        }
    }
    get state() {
        return this.vm._data.$$store
    }
    registerModule(path, rawModule) {
        path = Array.isArray(path) ? path : [path]
        this.modules.register(path, rawModule)

        installModule(this, path, rawModule.wrapperModule, this.state)
        resetVM(this, this.state)
    }

    subscribe(cb) {
        this._subscribes.push(cb)
    }

    replaceState(newState) {
        this.vm._data.$$store = newState
    }
}
// 只能处理一层 需要重写
// class Store {
//     constructor(options) {
//         const state = options.state
        

//         const getters = options.getters
//         this.getters = {}
//         const computed = {}
//         forEachValue(getters, (key, val) => {
//             computed[key] = () => val.call(this, this.state)
//             Object.defineProperty(this.getters, key, {
//                 get: () => this.vm[key]
//             })
//         })

//         this.vm = new Vue({
//             data: {
//                 // 以$$开头 vue会认为是一个vue内部的私有属性 不会代理到vm上，节约性能 不过取数据的时候要通过_data中取
//                 $$store: state,
//             },
//             computed,
//         })

//         const mutations = options.mutations
//         this.mutations = {}
//         forEachValue(mutations, (key, val) => {
//             this.mutations[key] = (payload) => val(this.state, payload) 
//         })

//         const actions = options.actions
//         this.actions = {}
//         forEachValue(actions, (key, val) => {
//             this.actions[key] = (payload) => val(this, payload)
//         })

//     }
//     commit = (name, payload) => {
//         this.mutations[name](payload)
//     }
//     dispatch = (name, payload) => {
//         this.actions[name](payload)
//     }
//     get state() {
//         return this.vm._data.$$store
//     }
// }

export default Store