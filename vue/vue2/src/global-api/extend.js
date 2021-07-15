import { mergeOptions } from "../util"

export default function initExtend(Vue) {
    let cid = 0
    // 核心就是创建一个子类继承父类
    Vue.extend = function (extendOptions) {
        const Super = this
        const Sub = function VueComponent(options) {
            this._init(options)
        }
        // 如果对象相同 应该复用构造函数（用id做个缓存）
        Sub.cid = cid++
        // 子类继承父类原型上的方法 原型继承
        Sub.prototype = Object.create(Super.prototype)
        Sub.prototype.constructor = Sub
        // 处理其他的属性 mixin component等等
        Sub.options = mergeOptions(Super.options, extendOptions)
        Sub.components = Super.components
        return Sub
    }
}
// 组件的渲染流程
/**
 * 1、调用Vue.component
 * 2、内部用的是Vue.extend来产生一个子类继承父类
 * 3、等会创建子类实例时会调用父类的_init方法，在$mount即可
 * 4、组件的初始化就是new这个组件的构造函数并且调用$mount方法
 * 5、创建虚拟节点 根据标签找到对应组件 生成组件的虚拟节点 componentOptions 里面包含ctor, children
 * 6、创建真实dom节点 先渲染的是父组件 遇到组件的虚拟节点时，调用组件的init方法，让组件初始化并挂载
 * 组件的$mount无参数会把渲染后的dom放到vm.$el => vnode.componentInstance中，这样渲染时 就获取这个对象
 * 的$el属性来渲染
 * 
 * 弹框组件 创建实例 挂载 拿到el渲染到页面上
 * 
 * 解析标签的顺序是先父后子 所以渲染的流程也是先父后子
 * 
 */