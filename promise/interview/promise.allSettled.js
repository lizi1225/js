const resolved = Promise.resolve(1)
const rejected = Promise.reject(-1)

const allSettledPromise = Promise.allSettled([resolved, rejected])

allSettledPromise.then((results) => {
  console.log(results)
})
/**
 * Promise.allSettled概念
 * 1. Promise.allSettled()方法接收一组Promise作为参数，返回一个新的Promise实例
 * 2. 只有等到所有的这些参数实例都返回结果，不管是fulfilled还是rejected，包装实例才会结束
 * 3. 返回新的Promise实例，一旦结束，状态总是fulfilled，不会变成rejected
 * 4. 新的promise实例给监听函数传递一个数组results。该数组的每个成员都是一个对象，对应传入Promise.allSettled的Promise实例。
 * 每个对象都有status属性，对应这fulfilled和rejected。fulfilled时，对象有value属性，rejected时有reason属性，对应两种状态的返回值。
 * 5. 有时候我们不关心异步操作的结果，只会关心这些操作有没有结束的时候，这时候比较适用。
 */
const formatSettledResult = (isSuccess, value) => {
  return isSuccess ? ({ status: 'fulfilled', value }) : ({ status: 'rejected', reason: value })
}

Promise.all_settled = function (promises) {
  if (!Array.isArray(promises)) {
    throw new Error('first parameter must be a array')
  }
  let num = 0, len = promises.length, results = Array(len)

  return new Promise((resolve, reject) => {
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((value) => {
        results[index] = formatSettledResult(true, value)
        if (++num === len) {
          resolve(results)
        }
      })
      .catch((reason) => {
        results[index] = formatSettledResult(false, reason)
        if (++num === len) {
          resolve(results)
        }
      })
    })
  })
}

const resolved1 = Promise.resolve(1);
const rejected1 = Promise.reject(-1);
Promise.all_settled([resolved1, rejected1]).then((results) => {
  console.log(results);
});