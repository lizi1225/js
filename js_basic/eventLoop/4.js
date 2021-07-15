let tasks = []
let delayTasks = []
function showName() {
    console.log('zhangsan')
}
function setTimeout(callback, timeout) {
    delayTasks.push({callback,timeout, start: Date.now()})
}
setTimeout(showName, 100)
setTimeout(showName, 200)
setTimeout(showName, 300)
setTimeout(showName, 3000)
// setTimeout(showName, 10000)
setInterval(() => {
    let task = tasks.shift()
    task && task()
    delayTasks = delayTasks.filter(item => {
        if (item.start + item.timeout <= Date.now()) {
            tasks.push(item.callback.bind(item))
            return false
        }
        return true
    })
}, 0)

// function task() {
//     console.log('zhangsan')
// }
// function exec() {
//     setTimeout(task, 100)
//     let end = Date.now() + 3000
//     while(Date.now() <= end) {
        
//     }
// }
// exec()