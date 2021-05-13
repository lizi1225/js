const {
    SyncHook
} = require('../tapable')
const syncHook = new SyncHook(['name', 'age'])

syncHook.intercept({
    context: true,
    register: (tapInfo) => {
        console.log(`${tapInfo.name}-1注册`)
        tapInfo.register1 = 'register1'
        return tapInfo
    },
    tap: (context, tapInfo) => {
        console.log('开始触发', context)
        if (context) {
            context.name1 = 'name1'
        }
    },
    call: (context, name, age) => {
        console.log('开始调用1', context, name, age)
    }
})
syncHook.intercept({
    context: true,
    register: (tapInfo) => {
        console.log(`${tapInfo.name}-2注册`)
        tapInfo.register2 = 'register2'
        return tapInfo
    },
    tap: (context, tapInfo) => {
        console.log('开始触发', context)
        if (context) {
            context.name2 = 'name2'
        }
    },
    call: (context, name, age) => {
        console.log('开始调用2', context, name, age)
    }
})

syncHook.tap({
    name: '函数A',
    context: true
}, (context, name, age) => {
    console.log(1, context, name, age)
})
syncHook.tap({
    name: '函数B',
    context: true
}, (name, age) => {
    console.log(2, name, age)
})
syncHook.call('zs', 18)