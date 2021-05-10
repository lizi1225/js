const {
    SyncHook
} = require('tapable')

const hook = new SyncHook(['name', 'age'])
hook.tap({
    name: 'tap1',
    stage: 1
}, (name, age) => {
    console.log(name, age)
})

hook.tap({
    name: 'tap2',
    stage: 3
}, (name, age) => {
    console.log(name, age)
})
hook.tap('3', (name, age) => {
    console.log(name, age)
})

hook.call('zs', 18)
hook.tap('4', (name, age) => {
    console.log(name, age)
})
hook.call('zs', 18)