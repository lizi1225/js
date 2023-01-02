const { init, parse } = require('es-module-lexer')
const MagicString = require('magic-string')

function importAnalysis(config) {
    return {
        name: 'importAnalysis',
        // 找到源文件中的第三方依赖 vue -> deps/vue.js
        async transform(source, importer)  {
            await init;
            const imports = parse(source)[0]
            if (!imports.length) {
                return source;
            }
            const { root } = config
            const ms = new MagicString(source)
            const normalizeUrl = async (url) => {
                const resolved = await this.resolve(url, importer)
                if (resolved && resolved.id.startsWith(root)) {
                    url = resolved.id.slice(root.length)
                }
                return url
            }
            for(let index = 0; index < imports.length; index++) {
                // n=vue
                const { s: start, e: end, n: specifier } = imports[index]
                if (specifier) {
                    const normalizedUrl = await normalizeUrl(specifier)
                    if (specifier !== normalizedUrl) {
                        ms.overwrite(start, end, normalizedUrl)
                    }
                }
            }
            return ms.toString()
        }
    }
}

module.exports = importAnalysis