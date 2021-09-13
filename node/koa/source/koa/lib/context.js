const context = {

}
function defineGetter(target, key) {
    // defineProperty的get方法
    context.__defineGetter__(key, function () {
        return this[target][key]
    })
}

function defineSetter(target, key) {
    context.__defineSetter__(key, function (value) {
        this[target][key] = value
    })
}
// delegate
defineGetter('request', 'path')
defineGetter('request', 'url')
defineGetter('request', 'query')

defineGetter('response', 'body')
defineSetter('response', 'body')

module.exports = context