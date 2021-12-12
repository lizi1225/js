## { "modules": false }
模块的关键字import export不要让babel进行转译，而是交给rollup进行处理

## 为什么学习rollup
了解tree-shaking原理，因为rollup最强大的功能就是tree-shaking

## rollup-plugin-babel 和 @rollup/plugin-node-resolve
@是私有作用域前缀，属于官方插件，只有rollup官方才能发布
rollup-plugin-babel 是社区插件

## 转成ast后修改源代码的思路
- 直接修改ast，再根据修改后的ast生成新的代码（webpack）
- 从源代码中提取想要的源码字符串，然后拼接成新的代码（rollup）

 webpack打包后还是存在模块，而rollup则将其全部打包到一个文件中

 ## scopeHoisting作用域提升

 ## treeShaking摇树
 我的理解：用map记录下哪些变量被导出，并记录导出变量的位置，然后排除掉已使用的变量，最后剩下的就是未使用的变量。

 问题：即使import的变量未使用，但import那一行代码可能有副作用。删除import可能会出问题。
 - 提取imports和exports