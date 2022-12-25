let activeEffect = null

const data = { a: 1 }

// 这里简单实现下effect，实际上effect是ReactiveEffect的一个实例
const effect = (fn) => {
    activeEffect = fn
    fn()
}
const proxyData = new Proxy(data, {
    get(target, key) {
        activeEffect = effect
        return target[key]
    },
    set(target, key, newVal) {
        target[key] = newVal
        activeEffect()
    }
})
effect(() => {
    console.log(proxyData.a)
})

setTimeout(() => {
    proxyData.a = 2
}, 1000)