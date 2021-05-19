const SingleEntryPlugin = require("./SingleEntryPlugin")

const itemToPlugin = (context, item, name) => {
    return new SingleEntryPlugin(context, item, name)
}
module.exports = class EntryOptionPlugin {
    constructor() {

    }
    apply(compiler) {
        compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
            itemToPlugin(context, entry, 'main').apply(compiler)
        })
    }
}