const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'


class Promise {
    // 初始化Promise对象
    constructor(executor) {
        // 初始化值为undefined
        this.value = undefined
        // 初始化错误值为undefined
        this.reason = undefined
        // 初始化状态为PENDING
        this.status = PENDING

        // 初始化resolve函数
        const resolve = (value) => {
            // 设置状态为FULFILLED
            this.status = FULFILLED
            // 设置值
            this.value = value
        }
        // 初始化reject函数
        const reject = (reason) => {
            // 设置状态为REJECTED
            this.reason = reason
            // 设置原因
            this.status = REJECTED
        }
        // 执行executor函数，并传入resolve和reject函数
        executor(resolve, reject);
    }
    then(onFulfilled, onRejected) {
        // 如果状态为FULFILLED，则调用onFulfilled函数，并传入this.value
       if (this.status === FULFILLED) {
        onFulfilled && onFulfilled(this.value)
       }
       // 如果状态为REJECTED，则调用onRejected函数，并传入this.reason
       if (this.status === REJECTED) {
        onRejected && onRejected(this.reason)
       }
    }
}

// 导出Promise模块
module.exports = Promise;