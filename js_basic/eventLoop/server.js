const http = require('http')
const server = http.createServer()
server.on('request', function(req, res) {
    res.end(JSON.stringify({message:'hello'}))
})
server.listen(3000, () => {
    console.log('listen in 3000')
})