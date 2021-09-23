
module.exports = {
  "root": true,
  "env": {
      "browser": true,
      "es2021": true,
      "node": true
  },
  "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
    //   'plugin:tree-eslint/myConfig',
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
  },
  "plugins": [
      "@typescript-eslint",
      "deadvars",
      "autofix",
      // 'tree-eslint',
      // 'autofix',
  ],
  "rules": {
      // "autofix/no-debugger": "error",
      'no-unused-vars': 2,
      '@typescript-eslint/no-unused-vars': 2,
      '@typescript-eslint/no-var-requires': 0,
      // 'tree-eslint/no-console-log': ['error', ['info']],
      'deadvars/dead-vars': 2,
      "autofix/no-debugger": "error",
      "autofix/no-unused-vars": "error",
  },
};
