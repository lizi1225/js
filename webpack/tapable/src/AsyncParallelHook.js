const {
    AsyncParallelHook
} = require('../tapable')

const hook = new AsyncParallelHook(['name', 'age'])

// hook.tapAsync('1', (name, age, callback) => {
//     setTimeout(() => {
//         console.log(1, name, age)
//         callback()
//     }, 1000)
// })

// hook.tapAsync('2', (name, age, callback) => {
//     setTimeout(() => {
//         console.log(2, name, age)
//         callback()
//     }, 2000)
// })

// hook.tapAsync('3', (name, age, callback) => {
//     setTimeout(() => {
//         console.log(3, name, age)
//         callback()
//     }, 3000)
// })
// console.time('cost')
// hook.callAsync('zs', 18, (err) => {
//     console.log('err', err)
//     console.timeEnd('cost')
// })
console.time('cost')
hook.tapPromise('1', (name, age) => {
    return new Promise((function (resolve) {
        setTimeout(() => {
            console.log(1, name, age)
            resolve()
        }, 1000)
    }))
})

hook.tapPromise('2', (name, age) => {
    return new Promise(function (resolve) {
        setTimeout(() => {
            console.log(2, name, age)
            resolve()
        }, 2000)
    })
})
hook.tapPromise('3', (name, age) => {
    return new Promise(function (resolve) {
        setTimeout(() => {
            console.log(3, name, age)
            resolve()
        }, 3000)
    })
})

hook.promise('zs', 18).then((result) => {
    console.log(result)
    console.timeEnd('cost')
})