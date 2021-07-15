import { initGlobalApi } from "./global-api/index"
import { initMixin } from "./init"
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./vdom/index"
import {stateMixin} from './state'

function Vue(options) {
    this._init(options)

}
// 原型方法
// 写成一个个的插件对原型的扩展
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)
stateMixin(Vue)

// 静态方法 Vue.components Vue.mixin Vue.directives Vue.extend
initGlobalApi(Vue)


// import { compileToFunctions } from "./compiler/index"
// import {createElm,patch} from './vdom/patch'
// const vm1 = new Vue({
//     data: {name:'zs'}
// })
// const render1 = compileToFunctions(
//     `<div>
//     <li style="background: red" key="A">A</li>
//     <li style="background: yellow" key="B">B</li>
//     <li style="background: pink" key="C">C</li>
//     <li style="background: green" key="D">D</li>
//     <li style="background: yellow" key="F">F</li>
    
//     </div>`)
// const vnode1 = render1.call(vm1)
// document.body.appendChild(createElm(vnode1))

// const vm2 = new Vue({
//     data: {name:'ls'}
// })
// const render2 = compileToFunctions(`<div>
//     <li style="background: green" key="M">M</li>
//     <li style="background: pink" key="B">B</li>
//     <li style="background: yellow" key="A">A</li>
//     <li style="background: red" key="Q">Q</li>
    
   

// </div>`)
// const vnode2 = render2.call(vm2)
// setTimeout(() => {
//   patch(vnode1, vnode2)
// }, 3000)


export default Vue