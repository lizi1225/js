const {
    AsyncSeriesHook,
    SyncBailHook,
    AsyncParallelHook,
    SyncHook
} = require('tapable')
const Stats = require('./Stats')
const Compilation = require('./Compilation')
const NormalModuleFactory = require('./NormalModuleFactory')
// 递归创建新的文件夹
const {sync} = require('mkdirp')
const path = require('path')

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
            emit: new AsyncSeriesHook(['compilation']),
            // 所有的编译全部都完成
            done: new AsyncSeriesHook(['stats']),
        }
    }
    emitAssets(compilation, callback) {
        const emitFiles = (err) => {
            const assets = compilation.assets
            // dist
            const outputPath = compilation.options.output.path
            for(let file in assets) {
                const source = assets[file]
                // 输入文件的绝对路径
                const targetPath = path.posix.join(outputPath, file)
                this.outputFileSystem.writeFileSync(targetPath, source, 'utf8')
            }
            callback()
        }
        // 写插件的时候emit用的很多，因为它是我们修改输出内容的最后机会
        this.hooks.emit.callAsync(compilation, () => {
            // 先创建输出目录dist，再写入文件
            sync(this.options.output.path)
            emitFiles()
        })
    }
    run(callback) {
        console.log('compiler run')
        // 编译完成后最终的回调
        // const finalCallback = (err, stats) => {
        //     callback(err, stats)
        // }
        const onCompiled = (err, compilation) => {
            this.emitAssets(compilation, err => {
                // 收集编译信息 chunks entries modules files
                const stats = new Stats(compilation)
                this.hooks.done.callAsync(stats, err => {
                    callback(err, stats)
                })
            })
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
                compilation.seal(err => {
                    this.hooks.afterCompile.callAsync(compilation, (err) => {
                        onCompiled(err, compilation)
                    })
                })
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