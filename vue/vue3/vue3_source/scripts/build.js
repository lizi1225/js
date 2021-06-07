const fs = require('fs')
// 单独开启一个进程进行打包
const execa = require('execa')

const targets = fs.readdirSync('packages').filter((item) => {
    return fs.statSync(`packages/${item}`).isDirectory()
})

async function build(target) {
    // rollup -c --config -w --watch
    return execa('rollup', ['-c', '--environment', 'TARGET:' + target], 
    { stdio: 'inherit' }) // 表示子进程中的输出结果会输出到父进程中
}

function runAll(targets) {
    const results = []
    for(let target of targets) {
        results.push(build(target))
    }
    return Promise.all(results)
}

runAll(targets).then((data) => {
    console.log('打包完毕')
})