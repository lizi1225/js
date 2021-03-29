function PromiseAll(promiseArray) {
    return new Promise((resolve, reject) => {
        if(!Array.isArray(promiseArray)) {
            return reject(new Error('传入的参数必须是数组'))
        }
        const promiseNums = promiseArray.length
        const results = new Array(promiseNums)
        let count = 0
        promiseArray.forEach((promise, index) => {
            Promise.resolve(promise).then(res => {
                results[index] = res
                if(++count === promiseNums) {
                    resolve(results)
                }
            })
            .catch(reject)
        })
    })
    
}

// 测试
const pro1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('1')
    }, 1000)
})
const pro2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('2')
    }, 2000)
})
const pro3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('3')
    }, 3000)
})

const proAll = PromiseAll([pro1, pro2, pro3])
.then(res => {
    console.log(res) // 3秒之后打印["1", "2", "3"]
})


const obj1 = {
    a: 1,
    b: 2
}
const obj2 = {
    b:1,
    a:2
}