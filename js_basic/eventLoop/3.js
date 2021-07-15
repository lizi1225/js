const {fork} = require('child_process')
let tasks = []
function showName() {
    console.log('zhangsan')
}
function setTimeout(callback, timeout) {
    const child = fork('./setTimeout.js')
    child.on('message', function(message) {
        if (message.ready) {
            tasks.push(callback)
        }
    })
    child.send({type: 'timer', timeout})
}
setTimeout(showName, 100)
setTimeout(showName, 100)
setTimeout(showName, 100)
setInterval(() => {
    const task = tasks.shift()
    task && task()
}, 0)