const path = require('path')
module.exports = {
  "fix": {
      flags: "-f, --fix",
      description: "is fix code",
      default: false,
      usage:"dc --fix"
  },
  "path": {
      flags: "-p, --path <path>",
      description: "tsconfig path",
      default: path.join(process.cwd(), 'tsconfig.json'),
      usage:"dc --path ./tsconfig.json"
  },
}