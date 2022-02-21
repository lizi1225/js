function resolveType(typeAnnotation) {
  const typeMap = {
    'TSStringKeyword': 'string',
    'TSNumberKeyword': 'number',
    'TSBooleanKeyword': 'boolean',
  }
  return typeMap[typeAnnotation.type]
}
const NODE_TYPES = {
  FUNCTION: 'function',
  CLASS: 'class',
}
module.exports = function (api) {
  return {
    pre(file) {
      file.set('docs', [])
    },
    post(file) {
    },
    visitor: {
      FunctionDeclaration(path, state) {
        const files = state.file.get('docs')
        const params = path.get('params').map((nodePath) => {
          return {
            name: nodePath.toString(),
            type: resolveType(nodePath.getTypeAnnotation().typeAnnotation),
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