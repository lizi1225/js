const {runLoaders} = require('loader-runner')
const path = require('path')
const fs = require('fs')

const filePath = path.resolve(__dirname, 'src', 'index.js')
const request = `inline1-loader!inline2-loader!${filePath}`
const rules = [
  {
    test: /\.js$/,
    use: ['normal1-loader', 'normal2-loader']
  },
  {
    test: /\.js$/,
    enforce: 'post',
    use: ['post1-loader', 'post2-loader']
  },
  {
    test: /\.js$/,
    enforce: 'pre',
    use: ['pre1-loader', 'pre2-loader']
  },
]

const parts = request.replace(/^-?!+/, '').split('!')
const resource = parts.pop()
const resolveLoader = loaderPath => path.resolve(__dirname, 'loaders', loaderPath)

const inlineLoaders = parts
const postLoaders = [],normalLoaders = [],preLoaders = []
for(let i = 0; i < rules.length; i++) {
  const rule = rules[i]
  if(rule.test.test(resource)) {
    if(rule.enforce === 'post') {
      postLoaders.push(...rule.use)
    }else if(rule.enforce === 'pre') {
      preLoaders.push(...rule.use)
    }else {
      normalLoaders.push(...rule.use)
    }
  }
}
// 最终生效的loader
let loaders = []
if(request.startsWith('!!')) {
  loaders.push(...inlineLoaders)
}else if(request.startsWith('-!')) {
  loaders.push(...postLoaders,...inlineLoaders)
}else if(request.startsWith('!')){
  loaders.push(...postLoaders,...inlineLoaders, ...preLoaders)
}else {
  loaders.push(...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders)
}
loaders = loaders.map(resolveLoader)

runLoaders({
  resource, // 要加载的资源
  loaders,
  context: {name: 'aa'},
  readResource: fs.readFile.bind(fs) // 读取硬盘文件的方法
}, (err, result) => {
  console.log(err, result)
  console.log(result.resourceBuffer.toString('utf8'))
})