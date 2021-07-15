const url = require('url')
const http = require('http')
process.on('message', message => {
    if (message.type === 'send') {
        let {options} = message
        const urlObj = url.parse(options.url)
        const config = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.path,
            method: options.method
        }
        const req = http.request(config, res => {
            const chunks = []
            res.on('data', function (data) {
                chunks.push(data)
            })
            res.on('end', () => {
                process.send({
                    type: 'response',
                    data: JSON.parse(chunks.toString())
                })
                process.exit()
            })
        })
        req.on('error', err => {
            console.log('error')
        })
        req.end()
    }
})