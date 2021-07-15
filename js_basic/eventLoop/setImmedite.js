// setTimeout(() => {
//     console.log('setTimeout')
// })
// setImmediate(() => {
//     console.log('setImmediate')
// })
const fs = require('fs')
const path = require('path')
fs.readFile(path.resolve(__dirname, '1.txt'), () => {
    setTimeout(() => {
        console.log('setTimeout')
    })
    setImmediate(() => {
        console.log('setImmediate')
    })
})
