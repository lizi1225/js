export function patchClass(el, nextValue) {
    if (nextValue == null) {
        el.removeAttribute(el, 'class')
    } else {
        el.className = nextValue
    }
}