## 热更新流程
1. 启动一个HTTP服务器，会打包我们的项目，并且让我们可以预览我们产出的文件，默认端口号8080
2. 还会启动一个websocket双向通信服务器，如果有新的模块发生变更的话，会通过消息的方式通知客户端，让客户端拉取最新代码，并且进行客户端的热更新

## require.resolve
解析模块的方法:
1. require.resolve('a') 会从node_modules里面找
2. 如果给的是相对路径，require.resolve('./a') 会从当前目录里面找，这时候跟path.resolve()类似，但path.resolve只管拼路径，而require.resolve在找不到模块时会报错