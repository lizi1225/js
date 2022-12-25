const { createServer } = require('./server');

(async () => {
    const server = await createServer()
    server.listen(3333, () => console.log('server listen in 3333'))
})()