const {
    SyncHook,
} = require('tapable')
const NormalModuleFactory = require('./NormalModuleFactory')
const normalModuleFactory = new NormalModuleFactory()
const Parser = require('./Parser')
const parser = new Parser()
const path = require('path')
const async = require('neo-async')
const Chunk = require('./Chunk')
const ejs = require('ejs')
const fs = require('fs')
const mainTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'main.ejs'), 'utf8')
const chunkTemplate = fs.readFileSync(path.join(__dirname, 'templates', 'chunk.ejs'), 'utf8')
const mainRender = ejs.compile(mainTemplate)
const chunkRender = ejs.compile(chunkTemplate)
module.exports = class Compilation {
    constructor(compiler) {
        this.compiler = compiler
        this.options = compiler.options
        this.context = compiler.context
        this.inputFileSystem = compiler.inputFileSystem
        this.outputFileSystem = compiler.outputFileSystem
        this.entries = [] // 入口模块
        this.modules = [] // 所有模块
        this._modules = {} // key模块id，值是模块对象
        this.chunks = []
        // 本次编译所有产出文件的文件名
        this.files = []
        this.assets = {}
        this.hooks = {
            // 成功构建模块
            succeedModule: new SyncHook(['module']),
            seal: new SyncHook(),
            beforeChunks: new SyncHook(),
            afterChunks: new SyncHook(),
        }
    }
    /**
     * 开始编译一个新的入口
     */
    addEntry(context, entry, name, finalCallback) {
        this._addModuleChain(context, entry, name, false, (err, module) => {
            finalCallback(err, module)
        })
    }
    _addModuleChain(context, rawRequest, name, async, callback) {
        const resource = path.posix.join(context, rawRequest)
        this.createModule({
            name,
            context,
            rawRequest,
            resource,
            parser,
            moduleId: './' + path.posix.relative(context, resource),
            async,
        }, entryModule => this.entries.push(entryModule), callback)
    }
    /**
     * 
     * @param {*} data 要编译的模块信息
     * @param {*} addEntry 可选的增加入口的方法 如果是入口模块则处理
     * @param {*} callback 
     */
    createModule(data, addEntry, callback) {
        // 通过模块工厂创建一个模块
        const module = normalModuleFactory.create(data)
        addEntry && addEntry(module)
        this.modules.push(module)
        this._modules[module.moduleId] = module
        const afterBuild = (err, module) => {
            // 编译依赖的模块
            if (module.dependencies.length > 0) {
                this.processModuleDependencies(module, err => {
                    callback(err, module)
                })
            } else {
                callback(err, module)
            }
        }
        this.buildModule(module, afterBuild)
    }
    /**
     * 编译模块依赖
     * @param {*} module ./src/index.js
     * @param {*} callback 
     */
    processModuleDependencies(module, callback) {
        const dependencies = module.dependencies
        async.forEach(dependencies, (dependency, done) => {
            const {
                name,
                context,
                rawRequest,
                moduleId,
                resource
            } = dependency
            this.createModule({
                name,
                context,
                rawRequest,
                resource,
                parser,
                moduleId,
            }, null, done)

        }, callback)

    }
    buildModule(module, afterBuild) {
        // 模块的真正的编译逻辑是放在module的内部完成的
        // 读文件 走loader配置得到js模块 转成ast 再分析依赖
        module.build(this, (err) => {
            // 一个module已经编译完成了
            this.hooks.succeedModule.call(module)
            afterBuild(err, module)
        })
    }
    /**
     * 把模块封装成chunk
     * @param {*} callback 
     */
    seal(callback) {
        this.hooks.seal.call()
        // 开始准备生成代码块
        this.hooks.beforeChunks.call()
        // 一般 一个入口生成一个代码块
        for(const entryModule of this.entries) {
            const chunk = new Chunk(entryModule)
            this.chunks.push(chunk)
            chunk.modules = this.modules.filter((module) => module.name === chunk.name)
        }
        this.hooks.afterChunks.call(this.chunks)
        this.createChunkAssets()
        callback()
    }
    createChunkAssets() {
        for(let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i]
            const file = chunk.name + '.js'
            chunk.files.push(file)
            let source;
            if(chunk.async) {
                source = chunkRender({
                    chunkName: chunk.entryModule.moduleId,
                    // [{moduleId: './src/index.js'},{moduleId: './src/title.js'}]
                    modules: chunk.modules,
                })
            }else {
                source = mainRender({
                    entryModuleId: chunk.entryModule.moduleId,
                    // [{moduleId: './src/index.js'},{moduleId: './src/title.js'}]
                    modules: chunk.modules,
                })
            }
            
            this.emitAssets(file, source)
        }
    }
    emitAssets(file, source) {
        this.assets[file] = source
        this.files.push(file)
    }
}