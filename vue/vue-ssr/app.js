// 1.创建vue实例
// const Vue = require('vue')
import Vue from 'vue'
import APP from './APP.vue'
import { createRouter } from './router'

// 2.创建渲染器
const renderer = require('vue-server-renderer').createRenderer()

// 3.将Vue实例渲染为HTML

// renderer.renderToString(app).then(html => {
//     console.log(html)
// })
export function createApp(context) {
    const router = createRouter()
    // return new Vue({
    //     data: {
    //         url: context.url
    //     },
    //     template: `<div>访问的 URL 是： {{ url }}</div>`
    // })
    const app = new Vue({
        render: h => h(APP),
        router,
    })
    return { app, router } 
}