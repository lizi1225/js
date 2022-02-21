const emptyFn = (v) => () => v
function resolveType(typeAnnotation, path, interfaces) {
  const typeMap = {
    'TSStringKeyword': emptyFn('string'),
    'TSNumberKeyword': emptyFn('number'),
    'TSBooleanKeyword': emptyFn('boolean'),
    'TSTypeReference': () => {
      const typeName = path.get('typeAnnotation').get('typeAnnotation').get('typeName').toString()
      const referenceNodePath = interfaces.find((path) => {
        const id = path.get('id').toString()
        return typeName === id
      })
      debugger
      console.log('referenceNodePath', referenceNodePath)
      console.log('TSInterfaceBody', referenceNodePath.get('TSInterfaceBody'))
      const TSInterfaceBody = referenceNodePath.get('TSInterfaceBody').map(bodyPath => {
        const key = bodyPath.get('key').toString()
        const value = resolveType(bodyPath.getTypeAnnotation().typeAnnotation, bodyPath, interfaces)
        return {
          key,
          value
        }
      })
      // console.log('TSInterfaceBody', TSInterfaceBody)
    },
  }
  return typeMap[typeAnnotation.type]()
}
const NODE_TYPES = {
  FUNCTION: 'function',
  CLASS: 'class',
}
module.exports = function (api) {
  return {
    pre(file) {
      file.set('docs', [])
      file.set('interfaces', [])
    },
    post(file) {
    },
    visitor: {
      TSInterfaceDeclaration(path, state) {
        const interfaces = state.file.get('interfaces')
        state.file.set('interfaces', interfaces.concat(path))
      },
      FunctionDeclaration(path, state) {
        const files = state.file.get('docs')
        const interfaces = state.file.get('interfaces')
        const params = path.get('params').map((nodePath) => {
          return {
            name: nodePath.toString(),
            type: resolveType(nodePath.getTypeAnnotation().typeAnnotation, nodePath, interfaces),
          }
        })
        const fnInfo = {
          type: NODE_TYPES.FUNCTION,
          name: path.get('id').toString(),
          params,
          return: resolveType(path.get('returnType').getTypeAnnotation()),
        }
        state.file.set('docs', files.concat(fnInfo))
      }
    }
  }
}