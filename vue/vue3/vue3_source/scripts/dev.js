const fs = require('fs')
// 单独开启一个进程进行打包
const execa = require('execa')

const target = 'reactivity'
async function build(target) {
    // rollup -c --config -w --watch
    return execa('rollup', ['-cw', '--environment', 'TARGET:' + target], 
    { stdio: 'inherit' }) // 表示子进程中的输出结果会输出到父进程中
}


build(target)