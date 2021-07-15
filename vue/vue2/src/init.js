import { compileToFunctions } from "./compiler/index"
import { callHook, mountComponent } from "./lifecycle"
import { initState } from "./state"
import { mergeOptions } from "./util"

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        //此时vm.constructor.options等价于Vue.options 但init方法可能是子组件来调用 
        vm.$options = mergeOptions(vm.constructor.options, options) // 需要将用户自定义的options和全局的options做合并
        callHook(vm, 'beforeCreate')
        // 初始化状态 数据劫持
        // vue组件中有很多状态 data props watch computed
        initState(vm)
        callHook(vm, 'created')

        // 如果当前有el属性 那开始渲染模板
        if(vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function (el) { // 挂载操作
        const vm = this
        const options = vm.$options
        el = document.querySelector(el)
        vm.$el = el
        if(!options.render) {
             let template = options.template
             if(!template && el) {
                template = el.outerHTML
             }
             const render = compileToFunctions(template)
             options.render = render
        }
        mountComponent(vm, el)
    }
}