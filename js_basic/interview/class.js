class Animal{
    // sayName=xx这种写法是实现在实例上的，相当于构造函数的this.sayName
    // I love则是在Monkey的原型上
    // sayName = () => { throw new Error('你应该自己实现这个方法') }
    sayName() { throw new Error('你应该自己实现这个方法') }
}
class Monkey extends Animal {
    sayName() {
        console.log('I love coding')
    }
}
const monkey = new Monkey()
monkey.sayName()