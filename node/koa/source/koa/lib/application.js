const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')

class Application {
    constructor() {
        this.context = Object.create(context)
        this.request = Object.create(request)
        this.response = Object.create(response)
        this.pendingList = []
    }
    use(fn) {
        this.pendingList.push(fn)
    }
    createContext(req, res) {
        const ctx = Object.create(this.context)
        const request = Object.create(this.request)
        const response = Object.create(this.response)
        ctx.request = request
        ctx.req = ctx.request.req = req

        ctx.response = response
        ctx.res = ctx.request.res = res
        

        return ctx
    }
    handleRequest = (req, res) => {
        const ctx = this.createContext(req, res)
        this.pendingList.forEach((fn) => fn(ctx))

        res.end(ctx.body)
    }
    listen() {
        const server = http.createServer(this.handleRequest)
        server.listen(...arguments)
    }
}

module.exports = Application