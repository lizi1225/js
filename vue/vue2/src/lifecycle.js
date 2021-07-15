import Watcher from "./observer/watcher"
import {
    patch
} from "./vdom/patch"

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        // 区分是首次渲染还是更新
        const prevVnode = vm._vnode
        if(!prevVnode) {
            vm.$el = patch(vm.$el, vnode)
        }else {
            vm.$el = patch(prevVnode,vnode)
        }
        vm._vnode = vnode
        


        
    }
}
export function mountComponent(vm, el) {
    // 调用render方法去渲染el属性
    callHook(vm, 'beforeMount')

    // 先调用render方法创建虚拟节点，并将虚拟节点渲染到页面上
    // vm._update(vm._render())
    const updateComponent = () => {
        vm._update(vm._render())
    }
    new Watcher(vm, updateComponent, () => {
        callHook(vm, 'updated')
    }, true)
    // 属性和watcher关联起来
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}