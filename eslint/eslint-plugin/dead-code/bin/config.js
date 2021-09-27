const path = require('path')
const { workDir } = require('../src/config')

module.exports = {
  // 是否修复unused-vars
  "fix": {
      flags: "-f, --fix",
      description: "is fix code",
      default: false,
      usage:"dc --fix"
  },
  // tsconfig的路径
  "path": {
      flags: "-p, --path <path>",
      description: "tsconfig path",
      default: path.join(workDir, 'tsconfig.json'),
      usage:"dc --path ./tsconfig.json"
  },
  // 是否删除未使用的文件
  "del": {
    flags: "-d, --del",
    description: "delete all unused files",
    default: false,
    usage:"dc --del"
  },
}