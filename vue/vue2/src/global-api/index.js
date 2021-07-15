import {
    mergeOptions
} from "../util"
import initExtend from "./extend"

export function initGlobalApi(Vue) {
    Vue.options = {} // Vue.components Vue.directives
    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
    }
    // Vue.options  
    Vue.options._base = Vue
    Vue.options.components = {}

    initExtend(Vue)

    Vue.component = function (id, definition) {
        definition.name = definition.name || id
        // 用的时候 new definition().$mount()
        definition = this.options._base.extend(definition)
        Vue.options.components[id] = definition
    }
}
