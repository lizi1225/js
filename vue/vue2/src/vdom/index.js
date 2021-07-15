import {
    isReservedTag
} from "../util"

export function renderMixin(Vue) { // 用对象来描述dom的结构
    // 创建虚拟元素
    Vue.prototype._c = function () {
        return createElement(this, ...arguments)
    }
    // stringify
    Vue.prototype._s = function (val) {
        return val == null ? '' : (typeof val === 'object') ? JSON.stringify(val) : String(val)
    }
    // 创建文本元素
    Vue.prototype._v = function (text) {
        return createTextVnode(text)
    }
    Vue.prototype._render = function () {
        const vm = this
        const render = vm.$options.render
        const vnode = render.call(vm)
        return vnode
    }
}

function createElement(vm, tag, data = {}, ...children) {
    // 如果是组件，我产生虚拟节点时 需要把组件的构造函数传入
    // new Ctor().$mount()
    if (isReservedTag(tag)) {
        return vnode(tag, data, data.key, children)
    }
    const Ctor = vm.$options.components[tag]
    // 创建组件的虚拟节点
    // children代表插槽了
    return createComponent(vm, tag, data, data.key, children, Ctor)
}

function createComponent(vm, tag, data, key, children, Ctor) {
    const baseCtor = vm.$options._base
    // Ctor可能是对象 或者构造函数
    if (typeof Ctor === 'object') {
        Ctor = baseCtor.extend(Ctor)
    }
    // 给组件增加生命周期
    data.hook = { // 稍后初始化组件时 会调用此init方法
        init(vnode) {
            const child = vnode.componentInstance = new Ctor({})
            child.$mount() // 组件的$mount中是不传递参数的
            // vnode.componentInstance.$el 指代的是当前组件的真实节点
        }
    }
    return vnode(`vue-component-${Ctor.cid}-${tag}`, data, key, undefined, undefined, {
        Ctor,
        children
    })

}

function createTextVnode(text) {
    return vnode(undefined, undefined, undefined, undefined, text)
}

function vnode(tag, data, key, children, text, componentOptions) {
    return {
        tag,
        data,
        key,
        children,
        text,
        componentOptions
        // componentsInstance: '',
        // slot
    }
}