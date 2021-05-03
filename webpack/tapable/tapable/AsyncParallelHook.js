const Hook = require('./Hook')
const HookCodeFactory = require('./HookCodeFactory')
class AsyncParallelHookCodeFactory extends HookCodeFactory {
    content({
        onDone
    }) {
        return this.callTapsParallel({
            onDone
        })
    }
}
const factory = new AsyncParallelHookCodeFactory()
class AsyncParallelHook extends Hook {
    constructor(...args) {
        super(...args)
    }
    compile(options) {
        factory.setup(this, options)
        return factory.create(options)
    }
}

module.exports = AsyncParallelHook