import { createRoute } from "../creat-matcher"

export default class Base {
    constructor(router) {
        this.router = router
        // 思路是将current属性变成响应式的，如果在渲染router-view的时候用到了这个current，等会current变化了
        // 就可以刷新视图
        this.current = createRoute(null, { path: '/' })
    }
    listen(cb) {
        this.cb = cb
    }
    transitionTo(location, callback) {
        // 根据路径进行匹配
        const record = this.router.match(location)
        

        this.current = createRoute(record, { path: location })
        this.cb && this.cb(this.current)
        // 只有第一次会传callback
        callback && callback()
    }
}