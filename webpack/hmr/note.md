## 热更新流程
核心：webpack + http + websocket + jsonp
1. 启动一个HTTP服务器，会打包我们的项目，并且让我们可以预览我们产出的文件，默认端口号8080
2. 还会启动一个websocket双向通信服务器，如果有新的模块发生变更的话，会通过消息的方式通知客户端，让客户端拉取最新代码，并且进行客户端的热更新
3. 服务器监听 webpack 打包的 done 事件，并发向客户端发送消息 hash 和 ok 消息
4. 客户端收到`hash`消息，保存hash值
5. 客户端收到`ok`消息，会派发`webpackHotUpdate`事件
6. webpack/hot/dev-server收到`webpackHotUpdate`事件，会执行`hotCheck`进行热更新检查，通过ajax拉取`[chunkId].[lastHash].hot-update.json`，创建script拉取`[chunkId].[lastHash].hot-update.js`两个补丁包，其中json文件包含更改的代码块，而js文件是最新的模块信息
7. js补丁包拉取下来后，会调用`webpackHotUpdate[包名]`方法，然后会改变`modules`对象，并删除原来模块的缓存，然后删除缓存，并通过当前模块 id 找到父模块执行`accept`回调，重新加载当前模块。

## require.resolve
解析模块的方法:
1. require.resolve('a') 会从node_modules里面找
2. 如果给的是相对路径，require.resolve('./a') 会从当前目录里面找，这时候跟path.resolve()类似，但path.resolve只管拼路径，而require.resolve在找不到模块时会报错