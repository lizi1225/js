## vue2和vue3的区别
- vue3最主要的特点就是小和快
- 移除了vue2中不常用的内容 如过滤器等
- vue3可以按需打包 借助了rollup可以支持函数的treeShaking能力，还提供了一些新增的组件。
- 快：proxy(defineProperty递归和重写属性)
- 整体的vue3架构发生了变化(采用了monorepo 分层清晰，一个项目中维护多个项目，可以利用项目中的某个部分)
- vue3对编译时的内容进行了重写(template => render函数)，静态标记还有属性标记 
pathFlag动态标记(标记哪些元素包含哪些属性，class，style，动态属性，指令)，静态提升，函数的缓存，使用了vue3模板内部有一个概念叫blockTree。如果你在vue中使用jsx就不会得到模板的优化，可以在写jsx的时候，自己标记。
- vue3使用了最长子序列重写了diff算法(这个的性能和vue2基本没有太大差异)
- vue3完全采用了ts来进行了重构，对ts兼容非常好，vue2对this的推荐不友好，vue3采用函数式的方式，对ts的推断是非常好的。
- vue3 CompositionApi(逻辑分类-最终组合)  vue2 optionsApi 分散逻辑(功能少，可以使用vue2的写法)

## vue3兼容vue2为什么会更小？
- 只是兼容了vue2的核心api，不再考虑IE11下的兼容性问题(删除了兼容代码)。