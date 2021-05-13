class Hook {
    constructor(args) {
        if (!Array.isArray(args)) args = []
        this._args = args
        this.taps = []
        this.interceptors = []
        this._call = CALL_DELEGATE
        this.call = CALL_DELEGATE
        this.callAsync = CALL_ASYNC_DELEGATE
        this.promise = PROMISE_DELEGATE
    }
    tap(options, fn) {
        this._tap('sync', options, fn)
    }
    tapAsync(options, fn) {
        this._tap('async', options, fn)
    }
    tapPromise(options, fn) {
        this._tap('promise', options, fn)
    }
    _tap(type, options, fn) {
        if (typeof options === 'string') options = {
            name: options
        }
        let tapInfo = {
            ...options,
            type,
            fn
        }
        tapInfo = this._runRegisterInterceptors(tapInfo)

        this._insert(tapInfo)
    }
    _runRegisterInterceptors(tapInfo) {
        for (const interceptor of this.interceptors) {
            if (interceptor.register) {
                let newTapInfo = interceptor.register(tapInfo)
                if (newTapInfo !== undefined) {
                    tapInfo = newTapInfo
                }
            }
        }
        return tapInfo
    }
    intercept(interceptor) {
        this.interceptors.push(interceptor)
    }
    compile() {
        throw new Error('Abstract: should be overridden')
    }
    _insert(tapInfo) {
        this._resetCompilation()
        // this.taps.push(tapInfo)
        let i = this.taps.length
        this.taps[i] = tapInfo
    }
    _resetCompilation() {
        this.call = this._call
    }
    _createCall(type) {
        return this.compile({
            taps: this.taps,
            args: this._args,
            interceptors: this.interceptors,
            type
        })
    }
}

const CALL_DELEGATE = function (...args) {
    this.call = this._createCall('sync')
    return this.call(...args)
}
const CALL_ASYNC_DELEGATE = function (...args) {
    this.callAsync = this._createCall('async')
    return this.callAsync(...args)
}
const PROMISE_DELEGATE = function (...args) {
    this.promise = this._createCall('promise')
    return this.promise(...args)
}
// stage 阶段的概念

module.exports = Hook