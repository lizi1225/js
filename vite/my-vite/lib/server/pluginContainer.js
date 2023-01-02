const { normalizePath } = require("../utils")

/**
 * 创建插件的容器
 * @returns 
 */
async function createPluginContainer({ plugins, root }) {
    class PluginContext {
        async resolve(id, importer) {
            return await container.resolveId(id, importer)
        }
    }
    const container = {
        async resolveId(path, importer) {
            let resolveId = path
            const ctx = new PluginContext()
            for(const plugin of plugins) {
                if (plugin.resolveId) {
                    const result = await plugin.resolveId.call(ctx, path, importer)
                    if (result) {
                        resolveId = result.id || result
                        break
                    }
                }
            }
            return { id: normalizePath(resolveId) }
        },
        async load(id) {
            const ctx = new PluginContext()
            for(const plugin of plugins) {
                if (plugin.load) {
                    const result = await plugin.load.call(ctx, id)
                    if (result) {
                        return result
                    }
                }
            }
            return null
        },
        async transform(code, id) {
            const ctx = new PluginContext()
            for(const plugin of plugins) {
                if (plugin.transform) {
                    const result = await plugin.transform.call(ctx, code, id)
                    if (result) {
                        code = result.code || result
                    }
                }
            }
            return { code }
        }
    }
    return container
}

exports.createPluginContainer = createPluginContainer