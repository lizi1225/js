import { defineProperty } from "../util"
import { arrayMethods } from "./array"
import Dep from "./dep"

class Observer {
    constructor(value) {
        this.dep = new Dep()
        defineProperty(value, '__ob__', this)
        

        if(Array.isArray(value)) {
            value.__proto__ = arrayMethods

            this.observeArray(value)
        }else { 
            this.walk(value)
        }
    }
    observeArray(value) {
        value.forEach(item => {
            observe(item)
        })
    }
    walk(data) {
        let keys = Object.keys(data)
        keys.forEach(key => {
            defineReactive(data, key, data[key]) // Vue.util.defineReactive
        })
    }
}

function defineReactive(data, key, value) {
    const childDep = observe(value)
    const dep = new Dep()
    Object.defineProperty(data, key, {
        get() {
            if(Dep.target) {
                dep.depend()
                if(childDep) {
                    childDep.dep.depend()
                }
            }
            return value
        },
        set(newValue) {
            if(newValue === value) return
            observe(newValue)
            value = newValue
            dep.notify()
        }
    })
}

export function observe(data) {
    if (typeof data !== 'object' || data === null) {
        return
    }
    
    if(data.__ob__) {
        return data
    }
    return new Observer(data)
}