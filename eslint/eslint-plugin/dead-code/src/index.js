const analyzeTsConfig = require('fork-ts-unused-exports').default
const path = require('path')
const chalk = require('chalk')

// 白名单
const whiteList = [path.resolve(__dirname, 'src', 'index.ts')]

const start = ({ path:p, fix }) => {
  const result = analyzeTsConfig(p);
  // console.log('res', JSON.stringify(result, null, 2))

  const unExports = result.files
  const filenameArr = Object.keys(unExports).map((filename) => {
    return {
      filename: filename,
      varsIgnorePattern: `^${unExports[filename].map((item) => item.exportName).join('|')}$`,
    }
  })

  const unUsedFiles = getUnUsedFiles(result)
  console.log('unUsedFiles：')
  console.log(chalk.green(unUsedFiles.join('，\r\n')))
  createCli({ filenameArr, fix })
}



function getUnUsedFiles({ allFiles, importFiles }) {
  const usedFileObj = importFiles.reduce((prev, current) => {
    const imports = current.imports
    Object.keys(imports).forEach((path) => {
      const currentFile = importFiles.find((file) => file.path === path)
      prev[currentFile.fullPath] = true
    })
    return prev
  }, {})
  return allFiles.map((absPath) => absPath.replace(/\//g, '\\')).filter((file) => !whiteList.includes(file) && !usedFileObj[file])
          
}



// unUsedFiles.forEach((unUsedFilesPath) => {
//   fs.readFile(unUsedFilesPath, (err, data) => {
//     console.log(err, data.toString())
//   })
// })

function createCli({ filenameArr, fix }) {
  const CLIEngine = require('eslint').CLIEngine
  const cli = new CLIEngine({
    'parserOptions': {
      'ecmaVersion': 12,
      'sourceType': 'module',
    },
    rules: {
      'deadvars/dead-vars': ['error', { filenameArr, vars: 'local' }],
      "autofix-fork/no-unused-vars": "error",
    },
    fix,
    useEslintrc: false,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'deadvars', 'autofix-fork'],
    envs: ['browser', 'es2021', 'node'],
    cwd: process.cwd(),
    extensions: ['.ts'],
  })
  // console.log(cli.getRules().get('deadvars/dead-vars'))
  const report = cli.executeOnFiles(['src'])
  // console.log(JSON.stringify(report, null, 2))
  // const formatter = cli.getFormatter();
  // // report.results = formatter(report.results)
  CLIEngine.outputFixes(report)

}

module.exports = {
  start
}