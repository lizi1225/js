const Server = require("./Server")
const Skeleton = require('./Skeleton')
const fs = require('fs')
const path = require('path')

const PLUGIN_NAME = 'SkeletonPlugin'
class SkeletonPlugin {
    constructor(options) {
        this.options = options
    }
    apply(compiler) {
        // done 整个编译流程都走完了 dist目录下的文件都生成了
        compiler.hooks.done.tap(PLUGIN_NAME, async () => {
            await this.startServer()
            this.skeleton = new Skeleton(this.options)
            // 启动一个无头浏览器
            await this.skeleton.initialize()
            // 生成骨架屏的html和style
            const skeletonHTML = await this.skeleton.genHTML(this.options.origin)
            console.log('skeletonHTML', skeletonHTML)
            const originPath = path.resolve(this.options.staticDir, 'index.html')
            const originHTML = await fs.readFileSync(originPath, 'utf-8')
            const finalHTML = originHTML.replace('<!-- shell-->', skeletonHTML)
            await fs.writeFileSync(originPath, finalHTML)
            // 销毁无头浏览器
            await this.skeleton.destroy()
            await this.server.close()
        })
    }
    async startServer() {
        this.server = new Server(this.options)
        await this.server.listen()
    }
}

module.exports = SkeletonPlugin