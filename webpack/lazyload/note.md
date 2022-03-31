## webpack import懒加载原理
1. 调用`__webpack_require__.e`方法加载模块
2. 声明一个promises数组，调用`__webpack_require__.f.j`方法，传入`chunkId`和`promises数组`，创建一个promise实例，将`[resolve, reject, promise]`存入`installedChunks`中
3. 调用`__webpack_require__.l`方法，创建`script标签`，发送请求加载脚本
4. 拿到脚本执行`webpackJsonpCallback`方法，将`installedChunks[chunkId]`改为0，并执行`resolve`方法让我们创建的promise成功
5. promise成功后会执行`require`方法去加载这个模块，拿到结果，需要注意的是，不管加载的是commonjs模块还是es module模块，最终拿到的结果都会包装成es module。