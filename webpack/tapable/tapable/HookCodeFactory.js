class HookCodeFactory {
    constructor() {

    }
    setup(hookInstance, options) {
        hookInstance._x = options.taps.map(item => item.fn)
    }
    init(options) {
        this.options = options
        this._args = options.args
    }
    deinit() {
        this.options = null
        this._args = null
    }
    args() {
        return this._args
    }
    header() {
        let code = ''
        code += 'var _x = this._x\n' // x是回调函数的数组
        return code
    }
    create(options) {
        this.init(options)

        let fn
        switch (this.options.type) {
            case 'sync':
                fn = new Function(
                    this.args(),
                    this.header() + this.content({
                        onDone: () => ""
                    })
                )

                break;

            default:
                break;
        }
        this.deinit()
        return fn
    }
    callTapsSeries({
        onDone
    }) {
        if (this.options.taps.length === 0) {
            return onDone()
        }
        let code = ''
        let current = onDone
        for (let j = this.options.taps.length - 1; j >= 0; j--) {
            const content = this.callTap(j, {
                onDone: current
            })
            current = () => content
        }
        code += current()
        return code
    }
    callTap(tapIndex, {
        onDone
    }) {
        let code = ''
        code += `var _fn${tapIndex} = _x[${tapIndex}];`
        const tap = this.options.taps[tapIndex]
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args()});`
                if (onDone) {
                    code += onDone()
                }
                break;

            default:
                break;
        }
        return code
    }
}

module.exports = HookCodeFactory