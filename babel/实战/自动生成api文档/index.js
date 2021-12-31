const parser = require('@babel/parser')
const { transformFromAstSync, transformSync } = require('@babel/core')
const path = require('path')
const fs = require('fs')

const autoGenDocPlugin = require('./plugins/auto-gen-doc-plugin')

const sourceCode = fs.readFileSync(path.resolve(__dirname, 'sourceCode.ts'), 'utf8')
const ast = parser.parse(sourceCode, {
  plugins: ['typescript'],
  sourceType: 'unambiguous',
})

/**
 * 思路：处理FunctionDeclaration和classDeclaration
 */

 const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[autoGenDocPlugin, {
      outputDir: path.resolve(__dirname, './docs'),
      format: 'markdown'// markdown html / json
  }]]
 })
