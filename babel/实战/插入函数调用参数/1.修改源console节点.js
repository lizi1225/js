const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const types = require('@babel/types')

const sourceCode = `
  console.log(1);
`
const sourceCode1 = `
  console.log(1);

  function func() {
      console.info(2);
  }

  export default class Clazz {
      say() {
          console.debug(3);
      }
      render() {
          return <div>{console.error(4)}</div>
      }
  }

`

const ast = parser.parse(sourceCode1, {
  sourceType: 'unambiguous',
  plugins: ['jsx'],
})

// console.log(ast)
const consoleProperties = ['log', 'info', 'error', 'debug']
traverse(ast, {
  CallExpression(path) {
    if (types.isMemberExpression(path.node.callee) && 
    path.node.callee.object.name === 'console' && 
    consoleProperties.includes(path.node.callee.property.name)) {
      const { line, column } = path.node.loc.start
      path.node.arguments.unshift(types.stringLiteral(`line: ${line}, column: ${column}`))
    }
    
  },
  MemberExpression(path) {
    // path.node.property.name = 'info'
  }
})

const { code, map } = generate(ast)
console.log(code)
