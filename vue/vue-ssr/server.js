const Vue = require('vue')
const server = require('express')()
const fs = require('fs')
const path = require('path')
const createApp = require('./app')
const e = require('express')

const renderer = require('vue-server-renderer').createRenderer({
    template: fs.readFileSync(path.resolve(__dirname, 'index.template.html'), 'utf8')
})
const globalContext = {
    title: 'hello world',
    meta: `<meta name="keyword" content="vue,ssr">
    <meta name="description" content="vue srr demo">`
  }

server.get('*', (req, res) => {
    const context = {
        url: req.url,
    }
    // const app = createApp(context)

    // renderer.renderToString(app, globalContext).then(html => {
    //     res.setHeader('content-type', 'text/html; charset=utf-8')
    //     res.end(
    //         html
    //     )
    // })
    createApp(context).then((app) => {
        renderer.renderToString(app, (err, html) => {
            if (err) {
                if (err.code === 404) {
                    res.status(404).end('Page not found')
                } else {
                    res.status(500).end('Internal Server Error')
                }
            } else {
                res.end(html)
            }
        })
    })
})

server.listen(3000)