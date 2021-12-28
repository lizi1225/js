import RouterLink from "./components/RouterLink"
import RouterView from "./components/RouterView"

export let Vue

const install = function (_vue) {
    Vue = _vue
    Vue.mixin({
        beforeCreate() {
            if (this.$options.router) {
                this._routerRoot = this
                this._router = this.$options.router
                this._router.init(this)
                Vue.util.defineReactive(this, '_route', this._router.history.current)
            } else if(this.$parent && this.$parent._routerRoot) {
                this._routerRoot = this.$parent._routerRoot
            }
        }
    })
    // 方便组件的取值 {path: '/', matched: [], params, query}
    Object.defineProperty(Vue.prototype, '$route', {
        get() {
            return this._routerRoot._route
        }
    })

    Object.defineProperty(Vue.prototype, '$router', {
        get() {
            // 路由实例上有match push replace等方法
            return this._routerRoot._router
        }
    })

    Vue.component('RouterLink', RouterLink)

    Vue.component('RouterView', RouterView)
}

export default install