const fs = require('fs')
const path = require('path')
const { transformFromAstSync } = require('@babel/core')
const parser = require('@babel/parser')
const autoTrackPlugin = require('./plugins/auto-track-plugin');

const sourceCode = fs.readFileSync(path.resolve(__dirname, 'sourceCode.js'), 'utf8')

const ast = parser.parse(sourceCode, {
    sourceType: 'unambiguous',
})

const { code } = transformFromAstSync(ast, sourceCode, {
    plugins: [[autoTrackPlugin, {
        trackerPath: 'tracker',
    }]]
})
console.log(code)