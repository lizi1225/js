const fs = require('fs-extra')
const { normalizePath } = require("../utils")
const { createPluginContainer } = require('../server/pluginContainer') 
const resolvePlugin = require('../plugins/resolve')

const htmlTypesRE = /\.html$/
const scriptModuleRE = /<script\s+type="module"\s+src\="(.+)">/
// const html = `<script type="module" src="/src/main.js"></script>`
// console.log(html.match(scriptModuleRE)[1])
async function esBuildScanPlugin(config, depImports) {
    const container = await createPluginContainer({
        plugins: [resolvePlugin(config)],
        root: config.root,
    })
    const resolve = async (path, importer) => {
        return await container.resolveId(path, importer)
    }
    return {
        // 依赖扫描插件
        name: 'vite:dep-scan',
        setup(build) {
            // 入口文件是index.html，找Index.html的真实路径 
            // importer 谁导入了它
            build.onResolve({ filter: htmlTypesRE }, async ({ path, importer }) => {
                // resolve会把任意路径转成绝对路径 path可能是相对/绝对/第三方路径
                const resolved = await resolve(path, importer)
                if (resolved) {
                    return {
                        path: resolved.id || resolved,
                        namespace: 'html',
                    }
                }
            })
            build.onResolve({ filter: /.*/ }, async ({ path, importer }) => {
                    // resolve会把任意路径转成绝对路径 path可能是相对/绝对/第三方路径
                    const resolved = await resolve(path, importer)
                    if (resolved) {
                        const id = resolved.id || resolved
                        if(id.includes('node_modules')) {
                            // depImports key是包名 value是es module格式入口文件的绝对路径
                            depImports[path] = normalizePath(id)
                            return {
                                path: id,
                                // 表示是一个外部模块 不需要进一步处理了
                                external: true,
                            }
                        } else {
                            return {
                                path: id,
                            }
                        }
                    }
            })
            // 读取文件内容的时候会执行这个钩子
            build.onLoad({
                filter: htmlTypesRE,
                namespace: 'html'
            }, ({ path }) => {
                // 把html转成js
                const html = fs.readFileSync(path, 'utf8')
                let [, src] = html.match(scriptModuleRE)
                let jsContent = `import ${JSON.stringify(src)}`
                return {
                    contents: jsContent,
                    loader: 'js',
                }
            })
        }
    }
}

module.exports = esBuildScanPlugin