const doctrine = require('doctrine');

function parseComment(commentStr) {
    if (!commentStr) {
        return;
    }
    return doctrine.parse(commentStr, {
        unwrap: true
    });
}

function getLeadingComments(path) {
  return path.node.leadingComments[0].value
}

const emptyWrapper = (v) => () => v
function resolveType(tsType, path, interfaces) {
  const typeAnnotation = tsType.typeAnnotation
  if (!typeAnnotation) {
    return
  }
  const typeMap = {
    'TSStringKeyword': emptyWrapper('string'),
    'TSNumberKeyword': emptyWrapper('number'),
    'TSBooleanKeyword': emptyWrapper('boolean'),
    // 'TSTypeReference': () => {
    //   const typeName = path.get('typeAnnotation').get('typeAnnotation').get('typeName').toString()
    //   const interfaceDefinition = path.hub.getScope().bindings[typeName].path
    //   console.log('interfaceDefinition', interfaceDefinition)
    //   console.log('scope1', path.scope.getBinding('IA'))
    //   const typeName = path.get('typeAnnotation').get('typeAnnotation').get('typeName').toString()
    //   const referenceNodePath = interfaces.find((path) => {
    //     const id = path.get('id').toString()
    //     return typeName === id
    //   })
    //   console.log('referenceNodePath', referenceNodePath)
    //   console.log('TSInterfaceBody', referenceNodePath.get('TSInterfaceBody'))
    //   const TSInterfaceBody = referenceNodePath.get('TSInterfaceBody').map(bodyPath => {
    //     const key = bodyPath.get('key').toString()
    //     const value = resolveType(bodyPath.getTypeAnnotation().typeAnnotation, bodyPath, interfaces)
    //     return {
    //       key,
    //       value
    //     }
    //   })
    //   console.log('TSInterfaceBody', TSInterfaceBody)
    // },
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
      console.log('file', JSON.stringify(file.get('docs'), null, 2))
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
            type: resolveType(nodePath.getTypeAnnotation(), nodePath, interfaces),
          }
        })

        const fnInfo = {
          type: NODE_TYPES.FUNCTION,
          name: path.get('id').toString(),
          params,
          return: resolveType({ typeAnnotation: path.get('returnType').getTypeAnnotation() }),
          doc: path.node.leadingComments && parseComment(getLeadingComments(path)),
        }
        state.file.set('docs', files.concat(fnInfo))
      },
      ClassDeclaration(path, state) {
        const files = state.file.get('docs')
        const classInfo = {
          type: NODE_TYPES.CLASS,
          name: path.get('id').toString(),
          constructorInfo: {},
          methodsInfo: [],
          propertiesInfo: [],
          doc: path.node.leadingComments && parseComment(getLeadingComments(path)),
        }
        path.traverse({
          ClassProperty(path) {
            classInfo.propertiesInfo.push({
              name: path.get('key').toString(),
              type: resolveType(path.getTypeAnnotation()),
              docs: path.node.leadingComments && parseComment(getLeadingComments(path)),
            })
          },
          ClassMethod(path) {
            if (path.node.kind === 'constructor') {
              classInfo.constructorInfo = {
                params: path.get('params').map(paramPath => {
                    return {
                        name: paramPath.toString(),
                        type: resolveType(paramPath.getTypeAnnotation()),
                        doc: path.node.leadingComments && parseComment(path.node.leadingComments[0].value)
                    }
                })
              }
            } else {
              classInfo.methodsInfo.push({
                name: path.get('key').toString(),
                doc: parseComment(path.node.leadingComments[0].value),
                params: path.get('params').map(paramPath=> {
                    return {
                        name: paramPath.toString(),
                        type: resolveType(paramPath.getTypeAnnotation())
                    }
                }),
                return: resolveType({ typeAnnotation: path.get('returnType').getTypeAnnotation() })
            })
            }
          }
        })
        state.file.set('docs', files.concat(classInfo))
      }
    }
  }
}