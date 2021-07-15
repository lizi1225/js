const { fork } = require('child_process');
let tasks = []; // 宏任务队列
let microTasks = [] // 微任务队列
class XMLHttpRequest {
    constructor() {
        this.options = {};
    }
    open(method, url) {
        this.options.method = method;
        this.options.url = url;
    }
    send() {
        let child = fork('./XMLHttpRequest.js');
        child.on('message', (message) => {
            if (message.type === 'response') {
                this.response = message.data;
                tasks.push(this.onload);
            }
        });
        child.send({ type: 'send', options: this.options });
    }
}


function getData() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/data');
    xhr.onload = function () {
        console.log(xhr.response);
    }
    xhr.send();
}
getData();
class Promise {
    constructor(executor) {
        executor(this.resolve)
    }
    then(onResolve) {
        this._onResolve = onResolve
    }
    resolve = (value) => {
        microTasks.push(() => this._onResolve(value))
    }
}
new Promise(function(resolve) {
    resolve('promise1')
}).then(res => console.log(res))
new Promise(function(resolve) {
    resolve('promise2')
}).then(res => console.log(res))
console.log('同步任务')
setInterval(() => {
    let task = tasks.shift()
    task && task()
    microTasks.forEach( task => task())
    microTasks = []
}, 0)
// 同步任务
// { message: 'hello' }
// promise1
// promise2