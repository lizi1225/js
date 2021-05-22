const {
    AsyncSeriesHook,
    SyncBailHook,
    AsyncParallelHook,
    SyncHook
} = require('tapable')
const Stats = require('./Stats')
const Compilation = require('./Compilation')
const NormalModuleFactory = require('./NormalModuleFactory')

class Compiler {
    constructor(context) {
        this.context = context || process.cwd()
        this.hooks = {
            done: new AsyncSeriesHook(['stats']),
            entryOption: new SyncBailHook(['context', 'entry']),
            beforeRun: new AsyncSeriesHook(['compiler']),
            run: new AsyncSeriesHook(['compiler']),
            beforeCompile: new AsyncSeriesHook(['params']),
            compile: new SyncHook(['params']),
            make: new AsyncParallelHook(['compilation']),
            // 开启一次新的编译
            thisCompilation: new SyncHook(['compilation', 'params']),
            // 创建完成一个新的Compilation
            compilation: new SyncHook(['compilation', 'params']),
            afterCompile: new AsyncSeriesHook(['compilation']),
        }
    }
    run(callback) {
        console.log('compiler run')
        // 编译完成后最终的回调
        const finalCallback = (err, stats) => {
            callback(err, stats)
        }
        const onCompiled = (err, compilation) => {
            console.log('onCompiled')
            finalCallback(err, new Stats(compilation))
        }
        this.hooks.beforeRun.callAsync(this, err => {
            this.hooks.run.callAsync(this, err => {
                this.compile(onCompiled)
            })
        })
    }
    compile(onCompiled) {
        const params = this.newCompilationParams()
        this.hooks.beforeCompile.callAsync(params, err => {
            this.hooks.compile.call(params)
            const compilation = this.newCompilation(params)
            this.hooks.make.callAsync(compilation, err => {
                console.log('make完成')
                onCompiled(err, compilation)
            })
        })
    }
    createCompilation() {
        return new Compilation(this)
    }
    newCompilation(params) {
        const compilation = this.createCompilation()
        this.hooks.thisCompilation.call(compilation, params)
        this.hooks.compilation.call(compilation, params)
        return compilation
    }
    newCompilationParams() {
        const params = {
            // 创建compilation之前已经创建了一个普通模块工厂
            normalModuleFactory: new NormalModuleFactory()
        }
        return params
    }
}

module.exports = Compiler