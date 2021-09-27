const chalk = require('chalk');
const { unlink, readdir, rmdir } = require('fs').promises
const path = require('path')

const { workDir, whiteList, ignoreFiles } = require('./config')

function getUnUsedFiles({ allFiles, importFiles }) {
  const usedFileObj = importFiles.reduce((prev, current) => {
    const imports = current.imports;
    Object.keys(imports).forEach((path) => {
      const currentFile = importFiles.find((file) => file.path === path);
      currentFile && (prev[currentFile.fullPath] = true);
    });
    return prev;
  }, {});
  return allFiles
    .map((absPath) => absPath.replace(/\//g, '\\'))
    .filter(
      (filePath) =>
        !whiteList.includes(filePath) &&
        !usedFileObj[filePath] &&
        !new RegExp(ignoreFiles, 'u').test(filePath)
    )
    .map((filePath) => path.relative(workDir, filePath));
}

function delUnusedFiles(targets = []) {
  targets.forEach((filePath) => {
    unlink(filePath)
    .then(() => {
      return delDir(path.join(filePath, '../'))
    })
    .catch((err) => {
      console.log(chalk.red(err))
    })
  })
}

function delDir(dirPath) {
  if (dirPath === workDir) {
    return Promise.resolve()
  }
  return readdir(dirPath)
  .then((files) => {
    if (files.length === 0) {
      rmdir(dirPath)
      return delDir(path.resolve(dirPath, '../'))
    }
  })
}



module.exports = {
  getUnUsedFiles,
  delUnusedFiles,
}