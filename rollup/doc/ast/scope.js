class Scope {
    constructor(options) {
        // 作用域的名字
        this.scopeName = options.scopeName
        // 父作用域 用于构建作用域链
        this.parentScope = options.parentScope
        // 此作用域内部定义的变量
        this.variableNames = options.variableNames || []
    }
    /**
     * 向当前的作用域添加变量
     * @param {*} name 
     */
    add(variableName) {
        this.names.push(variableName)
    }
    // 查找变量
    findDefiningScope(variableName) {
        if (this.variableNames.includes(variableName)) {
            // 返回当前作用域
            return this
        }
        if (this.parentScope) {
            return this.parentScope.findDefiningScope(variableName)
        }
        return null
    }
}

module.exports = Scope