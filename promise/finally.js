Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => {
      return P.resolve(callback()).then(() => value)
    },
    reason => {
      return P.resolve(callback()).then(() => {
        throw reason
      })
    }
  )
}
const p = new Promise((resolve, reject) => {
  reject('111')
}).finally(val => {
  console.log('finally', val)
}).then(res => {
  console.log('then', res)
}).catch(err => {
  console.log('err', err)
})