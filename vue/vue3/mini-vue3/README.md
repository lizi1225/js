## pnpm i vue -w 
- -w表示workspace-root 表示这个模块放在根目录下共享

## 幽灵依赖
比如express依赖了connect，我们就可以直接使用connect，但如果哪一天express不再依赖connect了，那connect就会丢失

## shamefully-hoist = true
默认幽灵依赖会放在.pnpm目录下，在.npmrc文件中加上这个配置会让幽灵依赖都放在node_modules下

## 响应式原理
1. 只代理一层 懒递归
2. 拦截新增属性和删除属性 

## composition api
1. vue2用的options api，用户编写复杂逻辑会出现反复横跳问题
2. vue2用mixin抽离公共逻辑会出现数据来源不明确、命令冲突的问题，composition api抽离公共逻辑更加方便
3. vue2中很多未使用的属性和方法也会被打包，并且所有的全局api都在vue对象上公开，vue3进行拆包，tree-shaking友好，代码也更容易压缩。
4. 抛弃了this，减少副作用，也不用关心this的指向问题