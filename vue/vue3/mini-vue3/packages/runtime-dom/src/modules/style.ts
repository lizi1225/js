export function patchStyle(el, prevValue, nextValue) {
    nextValue = nextValue || {}
    if (prevValue) {
        for(let key in prevValue) {
            if (nextValue[key] == null) {
                el.style[key] = null
            }
        }
    }
    for(let key in nextValue) {
        el.style[key] = nextValue[key]
    }
}