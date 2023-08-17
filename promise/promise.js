const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'


class Promise {
    constructor(executor) {
        this.value = undefined
        this.reason = undefined
        this.status = PENDING
        
         // 定义两个数组峰分别存储 then 里面成功的回调和失败的回调
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        const resolve = (value) => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        // 默认执行executor函数，并传入resolve和reject函数
        executor(resolve, reject);
    }
    then(onFulfilled, onRejected) {
       if (this.status === FULFILLED) {
        onFulfilled && onFulfilled(this.value)
       }
       if (this.status === REJECTED) {
        onRejected && onRejected(this.reason)
       }
       if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
            onFulfilled(this.value)
        })
        this.onRejectedCallbacks.push(() => {
            onRejected(this.reason)
        })
       }
    }
}

module.exports = Promise;