function Factory(fn, ...args) {
    const obj = Object.create(fn.prototype)
    const res = fn.apply(obj, args)
    return res instanceof Object ? res : obj
}
function People(name, age) {
    this.name = name
    this.age = age
}
const obj = Factory(People, 'name', 'age')
console.log(obj)
console.log(obj.name)
console.log(obj.age)