const {fork} = require('child_process')
let tasks = []
class XMLHttpRequest {
    constructor() {
        this.options = {}
    }
    open(method, url) {
        this.options.method = method
        this.options.url = url
    }
    send() {
        const child = fork('./XMLHttpRequest.js')
        child.on('message', (message) => {
            if (message.type === 'response') {
                this.response = message.data
                tasks.push(this.onload)
            }
        })
        child.send({type: 'send', options: this.options})
    }
}
function getData() {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:3000/data')
    xhr.onload = function () {
        console.log(xhr.response)
    }
    xhr.send()
}
getData()
setInterval(() => {
    const task = tasks.shift()
    task && task()
}, 0)
