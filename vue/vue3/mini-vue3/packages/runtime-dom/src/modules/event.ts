function createInvoker(value) {
    const invoker = (e) => invoker.value(e)
    invoker.value = value
    return invoker
}

export function patchEvent(el, eventName, nextValue) {
    const invokes = el._vei || (el._vei = {})
    const exists = invokes[eventName]
    if (exists && nextValue) {
        exists.value = nextValue
    } else {
        const event = eventName.slice(2).toLowerCase()
        if (nextValue) {
            const invoker = invokes[eventName] = createInvoker(nextValue)
            el.addEventListener(event, invoker)
        } else if (exists) {
            el.removeEventListener(event, exists)
            invokes[eventName] = undefined
        }
    }
}