const Koa = require('./koa')
const app = new Koa()

function sleep() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 2000)
    })
}
app.use(async (ctx, next) => {
    console.log(1)
    await next()
    await next()
    console.log(2)
    ctx.body = 'response'
})
app.use(async (ctx, next) => {
    console.log(3)
    await sleep()
    next()
    console.log(4)
})
app.use((ctx, next) => {
    console.log(5)
    next()
    console.log(6)
})
app.on('error', (e) => {
    console.log('error', e)
})

app.listen(3000, () => {
    console.log('server in 3000')
})