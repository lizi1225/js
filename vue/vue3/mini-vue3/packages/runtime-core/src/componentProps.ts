import { reactive } from "@vue/reactivity"
import { hasOwn } from "@vue/shared"

export function initProps(instance, rawProps) {
    const props = {}
    const attrs = {}
    const options = instance.propsOptions || {}

    if (rawProps) {
        for(let key in rawProps) {
            const value = rawProps[key]
            if (hasOwn(options, key)) {
                props[key] = value
            } else {
                attrs[key] = value
            }
        }
    }
    // 这里应该用shallowReactive
    instance.props = reactive(props)
    instance.attrs = attrs
}
const hasPropsChanged = (prevProps, nextProps) => {
    const nextKeys = Object.keys(nextProps)
    if (nextKeys.length !== Object.keys(prevProps).length) {
        return true
    }
    for(let i = 0; i < nextKeys.length; i++) {
        const key = nextKeys[i]
        if (nextProps[key] !== prevProps[key]) {
            return true
        }
    }
    return false
}

export function updateProps(instance, prevProps, nextProps) {
    if (hasPropsChanged(prevProps, nextProps)) {
        for(const key in nextProps) {
            instance.props[key] = nextProps[key]
        }
        for(const key in instance.props) {
            if (!hasOwn(nextProps, key)) {
                delete instance.props[key]
            }
        }
    }
}