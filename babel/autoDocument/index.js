const { transformFromAstSync } = require('@babel/core')
const parser = require('@babel/parser')
const path = require('path')
const fs = require('fs')
const AutoDocumentPlugin = require('./plugins/autoDocumentPlugin')
const combinePlugin = require('./plugins/combinePlugin')
const MagicString = require('magic-string')
const bundleString = new MagicString.Bundle()

const sourceCode = fs.readFileSync( path.resolve(__dirname, 'sourceCode.ts'), 'utf-8')

const ast = parser.parse(sourceCode, {
  plugins: ['typescript'],
  sourceType: 'unambiguous',
})

const { code } = transformFromAstSync(ast, sourceCode, {
  plugins: [[combinePlugin, {
    entryPath: __dirname,
    bundleString,
    root: true,
  }]]
})
bundleString.addSource({
  content: sourceCode,
  separator: '\n',
})
console.log(bundleString.toString())

// debugger
// const { code } = transformFromAstSync(ast, sourceCode, {
//   plugins: [AutoDocumentPlugin]
// })
