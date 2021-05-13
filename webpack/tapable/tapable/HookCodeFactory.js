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
    args(options = {}) {
        const {
            before,
            after
        } = options
        let allArgs = this.options.args || [];
        if (before) allArgs = [before, ...allArgs]
        if (after) allArgs = [...allArgs, after]
        if (allArgs.length > 0) {
            return allArgs.join(', ')
        }
        return ""
    }
    header() {
        let code = ''
        code += 'var _x = this._x\n' // x是回调函数的数组
        if (this.needContext()) {
            code += `var _context = {};\n`
        } else {
            code += `var _context;\n`
        }
        let len = this.options.interceptors.length
        if (len > 0) {
            code += `
                var _taps = this.taps;\n
                var _interceptors = this.interceptors;\n
            `
        }
        for (let i = 0; i < len; i++) {
            const intercept = this.options.interceptors[i]
            if (intercept.call) {
                code += `_interceptors[${i}].call(${this.args({
                    before: intercept.context ? '_context' : undefined
                })});\n`
            }
        }
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
            case 'async':
                fn = new Function(
                    this.args({
                        after: '_callback'
                    }),
                    this.header() + this.content({
                        onDone: () => "_callback()\n"
                    })
                )
                break;
            case 'promise':
                let content = this.content({
                    onDone: () => `_resolve();`
                })
                content = `
                    return new Promise(function (_resolve, _reject){
                        ${content}
                    });
                `
                fn = new Function(
                    this.args({
                        after: '_callback'
                    }),
                    this.header() + content
                )
                break;

            default:
                break;
        }
        this.deinit()
        return fn
    }
    callTapsParallel({
        onDone
    }) {
        let code = `var _counter = ${this.options.taps.length};\n`
        if (onDone) {
            code += `
                var _done = function() {
                    ${onDone()}
                };\n
            `
        }
        for (let i = 0; i < this.options.taps.length; i++) {
            const done = () => 'if (--_counter === 0) _done();\n'
            code += this.callTap(i, {
                onDone: done
            })
        }
        return code
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
    needContext() {
        for (const tap of this.options.taps) {
            if (tap.context) return true
        }
        return false
    }
    callTap(tapIndex, {
        onDone
    }) {
        let code = ''
        code += `var _tap${tapIndex} = _taps[${tapIndex}];`
        for (let i = 0; i < this.options.interceptors.length; i++) {
            const interceptor = this.options.interceptors[i]
            if (interceptor.tap) {
                code += `_interceptors[${i}].tap(${this.needContext() ? '_context,' : ''} _tap${tapIndex});\n`
            }
        }
        code += `var _fn${tapIndex} = _x[${tapIndex}];\n`
        const tap = this.options.taps[tapIndex]
        switch (tap.type) {
            case 'sync':
                code += `_fn${tapIndex}(${this.args({
                    before: this.needContext() ? '_context' : undefined
                })});`
                if (onDone) {
                    code += onDone()
                }
                break;
            case 'async':
                const cbCode = `
                 function (_err${tapIndex}) {
                     if (_err${tapIndex}) {
                         _callback(_err${tapIndex})
                     } else {
                         ${onDone()}
                     }
                 }\n
                `
                code += `_fn${tapIndex}(${this.args({after:cbCode})});`
                break;
            case 'promise':
                code = `
                 var _fn${tapIndex} = _x[${tapIndex}];
                 var _promise${tapIndex} = _fn${tapIndex}(${this.args()});
                 _promise${tapIndex}.then(
                     function () {
                         ${onDone()}
                     }
                 );
                `
                break;
            default:
                break;
        }
        return code
    }
}

module.exports = HookCodeFactory