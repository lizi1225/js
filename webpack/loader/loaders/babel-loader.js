const core = require('@babel/core')
function loader(source, inputSourceMap, data) {
  const options = {
    presets: ['@babel/preset-env'],
    inputSourceMap,
    sourceMaps: true, // 让babel生成sourcemap
    /**
     * this.request	/loaders/babel-loader.js!/src/index.js
        this.resourcePath	/src/index.js
     */
    filename: this.request.split("!")[1].split("/").pop()
  }
  const {code, map, ast} = core.transform(source, options)
  return this.callback(null, code, map, ast)
}

module.exports = loader