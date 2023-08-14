const Promise = require('./promise.js');

const p = new Promise((resolve, reject) => {
    resolve(111);
    // reject(11)
})
p.then((value) => {
    console.log('value', value)
}, (error) => {
    console.log('error', error)
})

// const p = new Promise((resolve, reject) => {
//     resolve(11);
// })
// p.then((value) => {
//     console.log(111)
// })
