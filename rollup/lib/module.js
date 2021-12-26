const MagicString = require('magic-string')
const { parse } = require('acorn')
const analyse = require('./ast/analyse')
const { hasOwnProperty } = require('./utils')
class Module {
    constructor({code, path, bundle}) {
        this.code = new MagicString(code, { filename: path })
        this.path = path
        this.bundle = bundle
        this.ast = parse(code, { ecmaVersion: 8, sourceType: 'module' })

        this.imports = {}
        this.exports = {}
        // 记录变量是在哪个语句节点中定义的
        this.definitions = {}
        this.analyse()
    }
    analyse() {
        // 1.找出所有的imports
        this.ast.body.forEach(statement => {
            if (statement.type === 'ImportDeclaration') {
                // ./msg
                const source = statement.source.value
                const specifiers = statement.specifiers
                specifiers.forEach(specifier => {
                    const importName = specifier.imported.name
                    const localName = specifier.local.name
                    this.imports[localName] = { localName, source, importName }
                })
            }

            if (statement.type === 'ExportNamedDeclaration') {
                const declaration = statement.declaration
                if (declaration.type === 'VariableDeclaration') {
                    const declarations = declaration.declarations
                    declarations.forEach(declaration => {
                        const localName = declaration.id.name
                        // 记录导出了哪些变量 这些变量是哪个声明语句声明的
                        this.exports[localName] = { localName, exportName: localName, declaration }
                    })
                }
            }
        })
        // 获取定义的变量和读取的变量
        analyse(this.ast, this.code, this)
        this.ast.body.forEach(statement => {
            Object.keys(statement._defines).forEach(name => {
                this.definitions[name] = statement
            })
        })
    }
    expandAllStatements() {
        const allStatements = []
        this.ast.body.forEach((statement) => {
            if (statement.type === 'ImportDeclaration') return
            const statements = this.expandStatements(statement)
            allStatements.push(...statements)
        })
        return allStatements
    }
    expandStatements(statement) {
        statement._include = true
        const result = []
        const depends = Object.keys(statement._dependsOn)
        depends.forEach(dependName => {
            const definition = this.define(dependName)
            result.push(...definition)
        })
        result.push(statement)
        return result
    }
    // 返回此变量对应的定义语句
    define(name) {
        // 判断这个变量是外部导入的 还是内部声明的
        if (hasOwnProperty(this.imports, name)) {
            const { localName, importName, source } = this.imports[name]
            // 获取依赖的模块
            const importModule = this.bundle.fetchModule(source, this.path)
            const { localName: externalLocalName } = importModule.exports[importName]
            return importModule.define(externalLocalName)
        } else {
            const statement = this.definitions[name]
            if (statement && !statement._include) {
                // 递归的原因是 可能导出了 export const a = b + c  需要递归处理b和c
                return this.expandStatements(statement)
            } else {
                return []
            }
        }
    }
}

module.exports = Module