/**
 * 
 *考点：
   1. 对不同的target进行复制 可能是对象、数组、date、正则
   2. 不必要复制原型上的属性 Object.getOwnPropertyDescriptors返回指定对象上一个自有属性对应的属性描述符（不包括原型链）
   3. 递归、循环引用
 */

function clone (target, map = new WeakMap()) {
    if (typeof target !== 'object' || typeof target === null) return target
    if (map.get(target)) return map.get(target)
    const newObj = new target.constructor()
    map.set(target, newObj)
    for(let key in Object.getOwnPropertyDescriptors(target)) {
        newObj[key] = clone(target[key], map)
    }
    return newObj
}

const obj1 = {
    a: {
        b: {
            c: 1
        }
    },
    d: 3,
    e: {}
}
obj1.a.b.a = obj1.a
console.log(obj1)

console.log(clone(obj1))