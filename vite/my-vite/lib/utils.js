function normalizePath(path) {
    return path.replace(/\\/g, '/')
}

const knownJsSrcRE = /\.((j|t)sx?|vue)/
function isJSRequest(url) {
    return knownJsSrcRE.test(url)
}

exports.normalizePath = normalizePath
exports.isJSRequest = isJSRequest