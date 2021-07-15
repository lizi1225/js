let id = 0
class Dep {
    constructor() {
        this.subs = []
        this.id = id++
    }
    depend() {
        // this.subs.push(Dep.target)
        Dep.target.addDep(this)
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }

}
// dep和watcher多对多的关系
Dep.target = null
const stack = []
export function pushTarget(watcher) {
    stack.push(watcher)
    Dep.target = watcher
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}

export default Dep