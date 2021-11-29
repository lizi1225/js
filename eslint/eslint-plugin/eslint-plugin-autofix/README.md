# fork-eslint-plugin-autofix

## Install & usage

```bash
$ npm i eslint-plugin-autofix-fork -D
```

add prefix "autofix" to the rulename in eslintrc:
```js
{
  "plugins": ["autofix-fork"],
  "rules": {
    "autofix-fork/no-unused-vars": "error"
  }
}
```
usage can see [eslint-plugin](https://www.npmjs.com/package/eslint-plugin-autofix)

## Acknowledgement
+ [ESLint](https://eslint.org)
+ [eslint-rule-composer](https://github.com/not-an-aardvark/eslint-rule-composer)