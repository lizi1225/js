const PENDING = 'PENDING' 
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(resolve, reject, x, p) {
    if (x === p) {
        return reject(new TypeError('TypeError: Chaining cycle detected for promise #<Promise>'));
    }
    if (typeof x === 'function' || (typeof x === 'object' && x !== null)) {
        let called = false
        try {
            const then = x.then
            if (typeof then === 'function') {
                then.call(x, (y) => {
                    if (called) return
                    called = true
                    resolvePromise(resolve, reject, y, p)
                }, (e) => {
                    if (called) return
                    called = true
                    reject(e)
                })
            } else {
                resolve(x)
            }
        } catch (e) {
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
        this.value = undefined
        this.reason = undefined
        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onFulfilledCallbacks.forEach((cb) => cb())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach((cb) => cb())
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        const p = new Promise((resolve, reject) => {
                onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (v) => v
                onRejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e }

                if (this.status === FULFILLED) {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value)
                            resolvePromise(resolve, reject, x, p)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                }
                if (this.status === REJECTED) {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason)
                            resolvePromise(resolve, reject, x, p)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                }
                if (this.status === PENDING) {
                    this.onFulfilledCallbacks.push(() => {
                        setTimeout(() => {
                            try {
                                const x = onFulfilled(this.value)
                                resolvePromise(resolve, reject, x, p)
                            } catch (e) {
                                reject(e)
                            }
                        }, 0)
                    })
                    this.onRejectedCallbacks.push(() => {
                        setTimeout(() => {
                            try {
                                const x = onRejected(this.reason)
                                resolvePromise(resolve, reject, x, p)
                            } catch (e) {
                                reject(e)
                            }
                        }, 0)
                    })
                }
        })

        return p
    }
    catch(err){
        return this.then(null,err)
    }
    static resolve(val){
        return new Promise((resolve,reject)=>{
            resolve(val);
        }) 
    }
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason);
        })
    }
}

// 测试时会调用此方法
Promise.deferred = function () {
    const dfd = {}
    dfd.promise = new Promise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}
// 测试包安装：npm install promises-aplus-tests -g 
// 测试命令：promises-aplus-tests 文件名
module.exports = Promise