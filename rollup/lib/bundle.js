const fs = require('fs')
const MagicString = require('magic-string')
const Module = require('./module')
const path = require('path')

class Bundle {
    constructor(options) {
        this.entryPath = path.resolve(options.entry.replace(/\.js$/, '') + '.js')
    }
    // filename: bundle.js
    build(filename) {
        const entryModule = this.fetchModule(this.entryPath)
        // 获取入口模块所有的语句节点
        this.statements = entryModule.expandAllStatements()
        const { code } = this.generate()
        fs.writeFileSync(filename, code)
    }
    /**
     * 
     * @param {*} importee 模块的路径，可能是绝对路径或相对路径
     */
    fetchModule(importee, importer) {
        let route
        // 如果importer为空 说明这是一个入口模块，没有引入它的父模块
        if (!importer) {
            route = importee
        } else {
            if (path.isAbsolute(importee)) {
                route = importee
            } else if (importee[0] === '.') {
                route = path.resolve(path.dirname(importer), importee.replace(/\.js$/, '') + '.js')
            }
        }
        if (route) {
            const code = fs.readFileSync(route, 'utf-8')
            const module = new Module({
                code,
                path: route,
                // bundle全局只有一份
                bundle: this,
            })
            return module
        }
    }
    generate() {
        const bundleString = new MagicString.Bundle()
        this.statements.forEach((statement) => {
            const source = statement._source.clone()
            if (/^Export/.test(statement.type)) {
                source.remove(statement.start, statement.declaration.start)
            }
            bundleString.addSource({
                content: source,
                separator: '\n'
            })
        })
        return { code: bundleString.toString()  }
    }
}

module.exports = Bundle