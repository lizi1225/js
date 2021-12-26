class Scope {
    constructor(options) {
        // 作用域的名字
        this.name = options.name
        // 父作用域 用于构建作用域链
        this.parent = options.parent
        // 此作用域内部定义的变量
        this.names = options.names || []
    }
    /**
     * 向当前的作用域添加变量
     * @param {*} name 
     */
    add(name) {
        this.names.push(name)
    }
    // 查找变量
    findDefiningScope(name) {
        if (this.names.includes(name)) {
            // 返回当前作用域
            return this
        }
        if (this.parent) {
            return this.parent.findDefiningScope(name)
        }
        return null
    }
}

module.exports = Scope