const resolve = require('resolve')
const pathLib = require('path')
const fs = require('fs-extra')

// 既是一个vite插件也是一个rollup插件
function resolvePlugin({ root }) {
    return {
        name: 'resolve',
        resolveId(path, importer) {
            if (path.startsWith('/')) {
                return {
                    id: pathLib.resolve(root, path.slice(1))
                }
            }
            if (pathLib.isAbsolute(path)) {
                return {
                    id: path,
                }
            }
            if (path.startsWith('.')) {
                const baseDir = importer ? pathLib.dirname(importer) : root
                const fsPath = pathLib.resolve(baseDir, path)
                return { id: fsPath }
            }
            // 第三方
            const res = tryNodeResolve(path, importer, root)
            if (res) return res
        }
    }
}
function tryNodeResolve(path, importer, root) {
    const pkgPath = resolve.sync(`${path}/package.json`, { basedir: root })
    const pkgDir = pathLib.dirname(pkgPath)
    const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
    const entryPoint = pkgContent.module
    const entryPointPath = pathLib.join(pkgDir, entryPoint)
    return { id: entryPointPath }
}

module.exports = resolvePlugin