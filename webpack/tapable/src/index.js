const {
    SyncHook
} = require('../tapable')

const hook = new SyncHook(['name', 'age'])
hook.tap('1', (name, age) => {
    console.log(name, age)
})

hook.tap('2', (name, age) => {
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