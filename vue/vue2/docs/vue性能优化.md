1. 使用函数式组件 函数式组件没有生命周期和响应式数据，只是返回普通的vnode，不会造成递归解析，开销小
2. child component splitting子组件拆分
3. local variables 局部变量
4. v-show
5. keepAlive 占用更大的内存，空间换时间
6. Deffrred features 使用 Deferred 组件延时分批渲染组件
7. Time slicing 时间分片
8. Non-reactive data 非响应式数据
9. virtual scrolling 虚拟滚动