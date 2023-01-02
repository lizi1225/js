const fs = require('fs-extra')

async function transformRequest(url, server) {
    const { pluginContainer } = server
    const { id } = await pluginContainer.resolveId(url)
    const loadResult = await pluginContainer.load(id)
    let code;
    if (loadResult) {
        code = loadResult.code
    } else {
        code = await fs.readFile(id, 'utf-8')
    }
    const result = await pluginContainer.transform(code, id)
    return result
}

module.exports = transformRequest