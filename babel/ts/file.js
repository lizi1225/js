// const glob = require('glob').default
const path = require('path')

exports.scanFileTs = function (scanPath) {
    const cwd = process.cwd()
    console.log(cwd)
    // const tsFiles = glob.sync(path.join(cwd, `${scanPath}/**/*.ts`))
    // const tsxFiles = glob.sync(path.join(cwd, `${scanPath}/**/*.tsx`))
    // return tsFiles.concat(tsxFiles)
}

exports.scanFileTs()