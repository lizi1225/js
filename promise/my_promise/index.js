const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('UnhandledPromiseRejectionWarning: TypeError: Chaining cycle detected for promise #<Promise>'))
    }
    let called
    // 判断x的类型 x是对象或函数才有可能是一个promise
    if (typeof x === 'object' && x !== null || typeof x === 'function') {
        try {
            const then = x.then
            if (typeof then === 'function') {
                // 只能认为它是一个promise
                then.call(x, (y) => {
                    if (called) return
                    called = true
                    resolvePromise(promise2, y, resolve, reject)
                }, (r) => {
                    if (called) return
                    called = true
                    reject(r)
                })
            }else {
                resolve(x)
            }
        } catch (e) { // 取then出错了，在错误中有调用了promise的成功
            if (called) return
            called = true
            reject(e)
        }
    } else {
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        this.resolve = (value) => {
            // if (value instanceof Promise) { // resolve的结果是一个promise
            //     return value.then(resolve, reject); // 那么会让这个promise执行，将执行后的结果在传递给 resolve或者reject中
            // }
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }

        this.reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }

        try {
            executor(this.resolve, this.reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        }
        const promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)


            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            }
            if (this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {

                        try {
                            const x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)


                })
            }
        })

        return promise2
    }
    catch (errCallback) { // 用来捕获错误 ， 语法糖
        return this.then(null, errCallback)
    }
}
// 测试脚本
Promise.defer = Promise.deferred = function () {
    let dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
/**
 * 成功：返回一个普通值或成功的promise
 * 失败：返回失败的promise或抛出异常
 * 
 * promise.then每次返回一个新的promise
 * 
 * npm install -g promises-aplus-tests
 * 使用命令 promises-aplus-tests index.js进行测试
 */


module.exports = Promise