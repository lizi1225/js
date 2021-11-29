const Scope = require('./ast/scope')
var a = 1
function one() {
    var b = 2
    function two() {
        var c = 3
        console.log(a, b, c)
    }
    two()
}
one()

const global = new Scope({
    scopeName: '全局',
    parentScope: null,
    variableNames: ["a"]
})

const oneScope = new Scope({
    scopeName: 'oneScope',
    parentScope: global,
    variableNames: ["b"]
})

const twoScope = new Scope({
    scopeName: 'twoScope',
    parentScope: oneScope,
    variableNames: ["c"]
})

const scope = twoScope.findDefiningScope('a')
console.log(scope)