


module.exports = class Chunk {
    constructor(entryModule) {
        this.entryModule = entryModule
        this.async = entryModule.async
        this.name = this.entryModule.name // main
        this.files = [] // 这个代码块生成了哪些文件
        this.modules = [] // 这个代码块生成了哪些模块
    }
}