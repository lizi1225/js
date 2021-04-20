// const obj = {
//     then(resolve) {
//         return resolve(4)
//     }
// }
Promise.resolve().then(() => {
    console.log(0)
    return Promise.resolve(4)
    // return obj
})
.then(res => {
    console.log(res)
})

Promise.resolve().then(() => {
    console.log(1)
}).then(() => {
    console.log(2)
}).then(() => {
    console.log(3)
}).then(() => {
    console.log(5)
})
.then(() => {
    console.log(6)
})