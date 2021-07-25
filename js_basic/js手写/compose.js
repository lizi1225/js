function compose(...args) {
  return [...args].reduceRight((memo, current) => current(memo))
}
const fn1 = val => val + 1
const fn2 = val => val + 2
const fn3 = val => val + 3
console.log(fn3(fn2(fn1(1))) === compose(fn3, fn2, fn1, 1))