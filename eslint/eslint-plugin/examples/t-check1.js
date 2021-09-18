const CLIEngine = require('eslint').CLIEngine
const cli = new CLIEngine({
  // baseConfig: {
  //   'extends': [
  //     'eslint:recommended',
  //     'plugin:@typescript-eslint/recommended',
  // },
  'parserOptions': {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  rules: {
    // 'no-unused-vars': 2,
    // '@typescript-eslint/no-unused-vars': 2,
    'tree-eslint/unused': ['error'],
  },
  useEslintrc: false,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'tree-eslint'],
  envs: ['browser', 'es2021', 'node'],
  cwd: process.cwd(),
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
})
const report = cli.executeOnFiles(['src/'])
console.log(JSON.stringify(report, null, 2))