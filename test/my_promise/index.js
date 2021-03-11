const Promise = require('../../promise/my_promise')

// const p = new Promise((resolve, reject) => {
//     console.log(1)
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve(2)
//         } ,100)
//     })
// }).then(res => {

// })
const promise = new Promise((resolve, reject) => {
    resolve()
})
const promise2 = promise.then(() => {
    return promise2
})
promise2.then(() => {}, err => {
    console.log('err', err)
})

