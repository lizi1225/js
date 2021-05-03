const {
    AsyncParallelHook
} = require('../tapable')

const hook = new AsyncParallelHook(['name', 'age'])

hook.tapAsync('1', (name, age, callback) => {
    setTimeout(() => {
        console.log(1, name, age)
        callback()
    }, 1000)
})

hook.tapAsync('2', (name, age, callback) => {
    setTimeout(() => {
        console.log(2, name, age)
        callback()
    }, 2000)
})

hook.tapAsync('3', (name, age, callback) => {
    setTimeout(() => {
        console.log(3, name, age)
        callback()
    }, 3000)
})
console.time('cost')
hook.callAsync('zs', 18, (err) => {
    console.log('err', err)
    console.timeEnd('cost')
})