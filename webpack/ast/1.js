const arr = [1,2,3]
function *test() {
  for(let key of arr) {
    yield key
  }
  // for(let i = 0; i < 3; i++) {
  //   yield i
  // }
}
const it = test()
console.log([...it])