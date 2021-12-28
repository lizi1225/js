import Vue from 'vue'
import VueRouter from '../vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      {
        path: 'a',
        name: 'A',
        component: {
          render() {
            return <div>a</div>
          }
        },
      },
      {
        path: 'b',
        name: 'B',
        component: {
          render() {
            return <div>b</div>
          }
        },
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})

export default router
