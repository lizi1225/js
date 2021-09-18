const analyzeTsConfig = require('ts-unused-exports').default
const result = analyzeTsConfig('./tsconfig.json');
const path = require('path')
const fs = require('fs')
// const unExports = result.unExports
const unExports = result
const filenameArr = Object.keys(unExports).map((filename) => {
  return {
    filename: filename,
    varsIgnorePattern: `^${unExports[filename].map((item) => item.exportName).join('|')}$`,
  }
})
// console.log('filenameArr', filenameArr)
// console.log(JSON.stringify(result, null, 2))

// 白名单
// const whiteList = [path.resolve(__dirname, 'src', 'index.ts')]


// function getUnUsedFiles({ allFiles, files }) {
//   const usedFileObj = files.reduce((prev, current) => {
//     const imports = current.imports
//     Object.keys(imports).forEach((path) => {
//       const currentFile = files.find((file) => file.path === path)
//       prev[currentFile.fullPath] = true
//     })
//     return prev
//   }, {})
//   return allFiles.map((absPath) => absPath.replace(/\//g, '\\')).filter((file) => !whiteList.includes(file) && !usedFileObj[file])
          
// }


// const unUsedFiles = getUnUsedFiles(result)
// unUsedFiles.forEach((unUsedFilesPath) => {
//   fs.readFile(unUsedFilesPath, (err, data) => {
//     console.log(err, data.toString())
//   })
// })
// console.log('unUsedFiles', unUsedFiles)

const CLIEngine = require('eslint').CLIEngine
const cli = new CLIEngine({
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  rules: {
    'deadvars/dead-vars': ['error', { filenameArr, vars: 'local' }],
  },
  useEslintrc: false,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'deadvars'],
  envs: ['browser', 'es2021', 'node'],
  cwd: process.cwd(),
  extensions: ['.ts'],
})
const report = cli.executeOnFiles(['src'])
console.log(JSON.stringify(report, null, 2))