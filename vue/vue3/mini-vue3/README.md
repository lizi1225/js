## pnpm i vue -w 
- -w表示workspace-root 表示这个模块放在根目录下共享

## 幽灵依赖
比如express依赖了connect，我们就可以直接使用connect，但如果哪一天express不再依赖connect了，那connect就会丢失

## shamefully-hoist = true
默认幽灵依赖会放在.pnpm目录下，在.npmrc文件中加上这个配置会让幽灵依赖都放在node_modules下