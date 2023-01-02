const send = require('../send')
const transformRequest = require('../transformRequest')
// const { parse } = require('url')
const { isJSRequest } = require('../../utils')

function transformMiddleware(server) {
    return async function(req, res, next) {
        if (req.method !== 'GET') return next()
        // let url = parse(req.url).pathname
        if (isJSRequest(req.url)) {
            const result = await transformRequest(req.url, server)
            if (result) {
                return send(req, res, result.code, 'js')
            } else {
                return next()
            }
        } else {
            return next()
        }
    }
}

module.exports = transformMiddleware