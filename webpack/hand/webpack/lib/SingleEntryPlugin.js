module.exports = class SingleEntryPlugin {
    constructor(context, entry, name) {
        this.context = context
        this.entry = entry
        this.name = name // 入口的名字
    }
    apply(compiler) {
        compiler.hooks.make.tapAsync('SingEntryPlugin', (compilation, callback) => {
            const {context, entry, name} = this
            console.log('SingEntryPlugin make')
            compilation.addEntry(context, entry, name, callback)
        })
    }
}