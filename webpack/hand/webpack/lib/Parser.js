const babylon = require('babylon')
const Tapable = require('tapable')
class Parser  {
    parse(source) {
        return babylon.parse(source, {
            // 源代码是一个模块
            sourceType: 'module',
            // 额外插件 支持import('./title.js) 动态导入
            plugins: ['dynamicImport']
        })
    }
}

module.exports = Parser