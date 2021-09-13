const Koa = require('./koa')
const app = new Koa()

app.use((ctx) => {
    console.log(ctx.req.url)
    console.log(ctx.request.req.url)

    console.log(ctx.request.url)
    console.log(ctx.path)

    ctx.body = 'a'
    ctx.body = 'b'
    ctx.response.body = 'c'
    console.log(ctx.body)
})

app.listen(3000, () => {
    console.log('server in 3000')
})