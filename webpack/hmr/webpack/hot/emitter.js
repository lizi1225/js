class EventEmitter {
    constructor() {
        this.events = {}
    }
    on(eventName, fn) {
        if (!this.events[eventName]) {
            this.events[eventName] = []
        }
        this.events[eventName].push(fn)
    }
    emit(eventName, ...args) {
        const cbs = this.events[eventName]
        if (cbs) {
            cbs.forEach(cb => cb(...args))
        }
    }
}

module.exports = new EventEmitter()