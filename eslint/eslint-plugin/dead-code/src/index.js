const analyzeTsConfig = require('fork-ts-unused-exports').default
const path = require('path')
const chalk = require('chalk')
const workDir = process.cwd()
// 白名单
const whiteList = [path.resolve(workDir, 'src', 'index.ts')]
const ignoreFiles = '(\.test)|(\.md$)|(\.d\.ts$)'

const start = ({ path:p, fix }) => {
  const result = analyzeTsConfig(p, [`--ignoreFiles=${ignoreFiles}`, '--excludeDeclarationFiles=true']);
  // console.log('res', JSON.stringify(result, null, 2))

  const unExports = result.files
  console.log('unExports', unExports)
  const filenameArr = Object.keys(unExports).map((filename) => {
    return {
      filename: filename,
      varsIgnorePattern: `^${unExports[filename].map((item) => item.exportName).join('|')}$`,
    }
  })

  const unUsedFiles = getUnUsedFiles(result)
  console.log(chalk.red('==================================================unUsedFiles=================================================='))
  unUsedFiles.forEach((filePath, index) => {
    console.log(chalk.green(`${index + 1}: ${filePath}`))
  })
  createCli({ filenameArr, fix })
}



function getUnUsedFiles({ allFiles, importFiles }) {
  console.log('allFiles', JSON.stringify(allFiles, null, 2))
  const usedFileObj = importFiles.reduce((prev, current) => {
    const imports = current.imports
    Object.keys(imports).forEach((path) => {
      const currentFile = importFiles.find((file) => file.path === path)
      currentFile && (prev[currentFile.fullPath] = true)
    })
    return prev
  }, {})
  return allFiles.map((absPath) => absPath.replace(/\//g, '\\'))
          .filter((filePath) => !whiteList.includes(filePath) && 
          !usedFileObj[filePath] && !(new RegExp(ignoreFiles, 'u').test(filePath))).map((filePath) => path.relative(workDir, filePath))
          
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
      'deadvars/dead-vars': [2, { filenameArr, vars: 'local' }],
      "autofix-fork/no-unused-vars": 2,
    },
    fix,
    useEslintrc: false,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'deadvars', 'autofix-fork'],
    envs: ['browser', 'es2021', 'node'],
    cwd: workDir,
    extensions: ['.ts'],
  })
  // console.log(cli.getRules().get('deadvars/dead-vars'))
  const report = cli.executeOnFiles(['src'])
  // console.log(JSON.stringify(report, null, 2))d
  // console.log(Object.keys(report))
  console.log(chalk.red('==================================================unUsedVars==================================================='))
  report.results.forEach(({ filePath, messages }, index) => {
    if (!messages.length) return
    console.log(chalk.green(`${index + 1}: ${path.relative(workDir, filePath)}`))
    messages = messages.filter(({ ruleId }) => ruleId !== 'autofix-fork/no-unused-vars')
    messages.forEach(({ message, ruleId, line, column }) => {
      console.log(`${chalk.yellow(`ruleId: ${ruleId}`)}, ${chalk.red(`message: ${message}`)}, ${chalk.green(`line: ${line}, column: ${column}`)}`)
    })
  })
  
  // const formatter = cli.getFormatter();
  // // report.results = formatter(report.results)
  CLIEngine.outputFixes(report)
  
}

module.exports = {
  start
}