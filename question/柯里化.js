// 实现 curry 函数，使得 console.log 的输出结果与行内注释一致
function add(a, b, c) {
  return a + b + c
}

function curry(fn) {
  const len = fn.length
  const args = []
  let collectArgFn
  if(len) {
    collectArgFn = function (...arg) {
      args.push(...arg)
      return args.length >= len ? fn.apply(null, args) : collectArgFn
    }
  }else {
    collectArgFn = function (...arg) {
      args.push(...arg)
      return collectArgFn
    }
    collectArgFn.toString = function () {
      const r = fn(...args)
      args.length = 0
      return r
    }
  }
  return collectArgFn
}

const add2 = curry(add)
console.log(add2(1)(2)(3)) // 6

function sum() {
  return [].reduce.call(arguments, (cur, acc) => cur + acc)
}

const sum2 = curry(sum)
console.log(sum2(1, 2)(3, 4) == 10) // true
console.log(sum2(1)(2)(3)(4)(5) == 15) // true

