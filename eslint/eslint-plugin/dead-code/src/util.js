const ts = require('typescript')
const fs = require('fs')
const path = require('path')

const { workDir } = require('./config')

function parseTsConfig(tsconfigPath) {
  try {
    const parseJsonResult = ts.parseConfigFileTextToJson(tsconfigPath, fs.readFileSync(tsconfigPath, { encoding: 'utf-8' }))
    if (parseJsonResult.error)
            throw parseJsonResult.error;
    return parseJsonResult
  } catch (e) {
    throw "\n    Cannot parse '" + tsconfigPath + "'.\n\n    " + JSON.stringify(e) + "\n  ";
  }
  
}

function addWhiteList(entries = [], whiteList) {
  whiteList.push(...entries.reduce((prev, cur) => {
    prev.push(path.resolve(workDir, cur, 'index.ts'), path.resolve(workDir, cur, 'index.js'))
    return prev
  }, []))
}

module.exports = {
  parseTsConfig,
  addWhiteList,
}