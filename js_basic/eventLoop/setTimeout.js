process.on('message', function(message) {
    const {type, timeout} = message
    if (type === 'timer') {
        let end = Date.now() + parseFloat(timeout)
        setInterval(() => {
            if (Date.now() >= end) {
                process.send({ready: true})
                process.exit()
            }
        }, 0)

    }
})