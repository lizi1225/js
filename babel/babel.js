const { transformSync } = require('@babel/core')

const sourceCode = `const a = (a, b) => a + b; a(1, 2);`
const res = transformSync(sourceCode, {
  sourceType: 'unambiguous',
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
  presets: ['@babel/preset-env']
})
console.log(res.options.plugins.filter(({key}) => key.includes('decorator')))