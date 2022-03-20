# vue-router-原理
1. 调用Vue.mixin，在混入的beforeCreate钩子中对路由进行初始化
2. 创建一个匹配器matcher，将路由表routes转化为一个路由映射表pathMap 
{
  /: {component: {}, name: "Home",parent: undefined, path: "/"},
  /about: {path: '/about', name: 'About', parent: undefined, component: ƒ},
  /about/a: {path: '/about/a', name: 'A', component: {…}, parent: {…}},
  /about/b: {path: '/about/b', name: 'B', component: {…}, parent: {…}},
}
3. 调用transitionTo方法进行跳转：先根据 location match 到对应的record，this.current = {path: '/', matched: []}
4. app._router = this.current 触发页面响应式 重新渲染组件
5. 监听hashchange/popstate（第一次）
6. 给每个组件定义_router，_route属性，并给Vue的原型上定义$router和$route，以及注册RouterView和RouterLink组件

## 路由钩子
全局导航守卫->路由独享导航守卫->组件内部守卫->导航钩子队列
1. beforeRouteLeave 
2. beforeEach
3. beforeRouteUpdate
4. beforeEnter（路由）
5. 解析异步路由组件
6. beforeRouteEnter
7. beforeResolve
8. afterEach