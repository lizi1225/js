import { reactive } from './reactive';
import { isArray, isObject } from "@vue/shared"
import { trackEffects, triggerEffects } from './effect';

function toReactive(value) {
    return isObject(value) ? reactive(value) : value
}

class RefImpl {
    public dep = new Set()
    public _value
    public __v_isRef = true
    constructor(public rawValue) {
        this._value = toReactive(rawValue)
    }
    get value() {
        trackEffects(this.dep)
        return this._value
    }
    set value(newValue) {
        if (newValue !== this.rawValue) {
            this._value = toReactive(newValue)
            this.rawValue = newValue
            triggerEffects(this.dep)
        }
    }
}



// reactive只可以放对象 ref里面可以任意值
export function ref(value) {
    return new RefImpl(value)
}
class ObjectRefImpl {
    constructor(public object, public key) {

    }
    get value() {
        return this.object[this.key]
    }
    set value(newValue) {
        this.object[this.key] = newValue
    }
}
function toRef(object, key) {
    return new ObjectRefImpl(object, key)
}
export function toRefs(object) {
    const result = isArray(object) ? new Array(object.length) : {}

    for(let key in object) {
        result[key] = toRef(object, key)
    }

    return result
}

export function proxyRefs(object) {
    return new Proxy(object, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)
            return res.__v_isRef ? res.value : res
        },
        set(target, key, value, receiver) {
            const oldValue = target[key]
            if (oldValue.__v_isRef) {
                oldValue.value = value
                return true
            }
            return Reflect.set(target, key, value, receiver)
        }
    })
}