const {
    SyncHook,
    HookMap
} = require('tapable')
const keyedHookMap = new HookMap(key => new SyncHook(['name']))

keyedHookMap.tap('key1', 'plugin1', (name) => {
    console.log(1, name)
})
keyedHookMap.for('key2').tap('plugin2', (name) => {
    console.log(2, name)
})

const hook1 = keyedHookMap.get('key1')
hook1.call('zs')

const hook2 = keyedHookMap.get('key1')
hook2.call('lisi')