const fs = require('fs')
const { resolve } = require('path')
const parser = require('@babel/parser')
const { transformFromAstSync } = require('@babel/core')
const MagicString = require('magic-string')


function resolveExtensions(absPath) {
  const extensions = ['.js', '.ts', '.jsx', '.tsx']
  const reges = extensions.map((extension) => {
    return new RegExp(`\\${extension}$`)
  })
  const isJSFile = (absPath) => reges.find(reg => reg.test(absPath))
  if (isJSFile(absPath)) {
    return absPath
  }
  for(const extension of extensions) {
    const combinePath = absPath + extension
    if (fs.existsSync(combinePath) && isJSFile(combinePath)) {
      return combinePath
    }
  }
  return false
}

function extractExportDeclaration(nodePath, options, id) {
  const collectNode = ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration']
  const type = nodePath.node.declaration.type
  if (!collectNode.includes(type)) {
    return
  }
  const path = nodePath.get('declaration')
  const node = path.node
  if (options.magicString) {
    id = id || path.get('id').toString()
    if (options.imported && !options.imported.find(({ importedName }) => importedName === id)) return
    const source = options.magicString.snip(node.start, node.end)
    options.bundleString.addSource({
      content: source,
      separator: '\n'
    })
  }
}
const combinePlugin = function (api, options) {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const specifiers = path.node.specifiers
        const imported = specifiers.map(specifier => {
          if (specifier.type === 'ImportDefaultSpecifier') {
            return {
              importedName: 'default',
              localName: specifier.local.name,
            }
          }
          return {
            importedName: specifier.imported.name,
            localName: specifier.local.name,
          }
        })
        const value = path.node.source.value
        const absPath = resolveExtensions(resolve(options.entryPath, value))
        if (!absPath) {
          return
        }
        const sourceCode = fs.readFileSync(absPath, 'utf-8')
        const ast = parser.parse(sourceCode, {
          plugins: ['typescript'],
          sourceType: 'unambiguous',
        })
        const magicString = new MagicString(sourceCode, {
          filename: absPath
        })
        const { code } = transformFromAstSync(ast, sourceCode, {
          plugins: [[combinePlugin, {
            entryPath: options.entryPath,
            bundleString: options.bundleString,
            magicString,
            imported,
          }]]
        })
      },
      ExportNamedDeclaration(path, state) {
        // console.log('type', type)
        // console.log('type1', path.get(type))
        extractExportDeclaration(path, options)
      },
      ExportDefaultDeclaration(path) {
        extractExportDeclaration(path, options, 'default')
      },
      TSInterfaceDeclaration(path, state) {
        // extractString(path, options)
        // console.log('path', path)
      },
      // TSTypeAliasDeclaration(path, state) {
      //   extractString(path, options)
      // }
    }
  }
}

module.exports = combinePlugin