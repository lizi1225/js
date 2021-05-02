class Hook {
    constructor(args) {
        if (!Array.isArray(args)) args = []
        this._args = args
        this.taps = []
        this._call = CALL_DELEGATE
        this.call = CALL_DELEGATE
    }
    tap(options, fn) {
        this._tap('sync', options, fn)
    }
    _tap(type, options, fn) {
        if (typeof options === 'string') options = {
            name: options
        }
        this._insert({
            ...options,
            type,
            fn
        })
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
            type
        })
    }
}

const CALL_DELEGATE = function (...args) {
    this.call = this._createCall('sync')
    return this.call(...args)
}

// stage 阶段的概念

module.exports = Hook