const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
const EventEmitter = require('events')

class Application extends EventEmitter {
    constructor() {
        super()
        this.context = Object.create(context)
        this.request = Object.create(request)
        this.response = Object.create(response)
        this.middleWares = []
    }
    use(middleWare) {
        this.middleWares.push(middleWare)
    }
    createContext(req, res) {
        const ctx = Object.create(this.context)
        const request = Object.create(this.request)
        const response = Object.create(this.response)
        ctx.request = request
        ctx.req = ctx.request.req = req

        ctx.response = response
        ctx.res = ctx.response.res = res
        

        return ctx
    }
    compose(ctx) {
        let index = -1
        const dispatch = (i) => {
            if (index >= i) {
                return Promise.reject('Error: next() called multiple times')
            }
            if (this.middleWares.length === i) {
                return Promise.resolve()
            }
            index = i
            try {
                return Promise.resolve(this.middleWares[i](ctx, () => dispatch(i + 1)))
            } catch (error) {
                return Promise.reject(error)
            }
        }
        return dispatch(0)
    }
    handleRequest = (req, res) => {
        const ctx = this.createContext(req, res)
        res.statusCode = 404
        
        this.compose(ctx).then(() => {
            const body = ctx.body
            if (body) {
                res.end(ctx.body)
            }else {
                res.end('Not Found')
            }
        }).catch((e) => {
            this.emit('error', e)
        })
        
        
    }
    listen() {
        const server = http.createServer(this.handleRequest)
        server.listen(...arguments)
    }
}

module.exports = Application