export let activeEffect = undefined
function cleanupEffect(effect) {
    const { deps } = effect
    for(let i = 0; i < deps.length; i++) {
        deps[i].delete(effect)
    }
    effect.deps.length = 0
}
export class ReactiveEffect {
    public parent = null
    public deps = []
    public active = true
    constructor(public fn, public scheduler) {
    }
    run() {
        if (!this.active) {
            // 非激活状态 不需要依赖收集
            return this.fn()
        }
        try {
            this.parent = activeEffect
            activeEffect = this

            cleanupEffect(this)
            return this.fn()
        } finally {
            activeEffect = this.parent
            this.parent = null
        }
    }
    stop() {
        if (this.active) {
            this.active = false
            cleanupEffect(this)
        }
    }
}


export const effect = (fn, options:any = {}) => {
    // effect可嵌套
    const _effect = new ReactiveEffect(fn, options.scheduler)
    _effect.run()
    const runner = _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

const targetMap = new WeakMap()
export function track(target, type, key) {
    if (!activeEffect) return

    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    trackEffects(dep)
}

export function trackEffects(dep) {
    if (!activeEffect) return
    // 用has判断一下比直接添加进set性能好，因为不需要set自己去重
    const shouldTrack = !dep.has(activeEffect)
    if (shouldTrack) {
        dep.add(activeEffect)
        // 双向记录 当effect出现分支控制时，可以进行effect的清理
        activeEffect.deps.push(dep)
    }
}

export function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target)
    if (!depsMap) return
    let effects = depsMap.get(key)
    if (effects) {
        triggerEffects(effects)
    }

}

export function triggerEffects(effects) {
    // set.forEach不会拷贝 arr.forEach会拷贝
    effects = new Set(effects)
    effects.forEach(effect => {
        // 不重复执行自己
        if (effect !== activeEffect) {
            if (effect.scheduler) {
                effect.scheduler()
            } else {
                effect.run()
            }
        }
    })
}

/**
 * 
 * {
 *  {name:1,age:2}: {name: [], age: []}
 * }
 */